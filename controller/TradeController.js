'use strict';

const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');
const Portfolio = mongoose.model('Portfolio');
const Transaction = mongoose.model('Transaction');

/**
 * Fetch Stocks
 * @param {Request} req 
 * @param {Response} res 
 * @api public
 * @returns {successResponse}
 */
const getStocks = async (req, res) => {
    let err, stocks;
    [err, stocks] = await to(Stock.find());
    if (err) return ReE(res, err, 422);
    return successResponse(res, 200, stocks, 'Stocks fetched successfully.');
}

/**
 * Add Stocks
 * @param {Request} req 
 * @param {Response} res 
 * @api public
 * @returns {createdResponse}
 */
const addStock = async (req, res) => {
    const { name, price } = req.body;
    let data, err;
    [err, data] = await to(Stock.create({ name, price }));
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Stock created successfully');
}

/**
 * Adding trades for a security, and updating the portfolio accordingly.
 * @param {Request} req 
 * @param {Response} res 
 * @throws {badRequestError, notFoundError, errorResponse}
 * @api public
 * @returns {createdResponse}
 */
const addTrade = async (req, res) => {
    const { _stockId, quantity } = req.body;
    if (!_stockId) {
        return badRequestError(res, 'Request expects param `StockId`');
    }
    if (!quantity || quantity <= 0) {
        return badRequestError(res, 'Request expects a positive int param `quantity`');
    }
    let stock = await Stock.findById(_stockId);
    if (!stock) {
        return notFoundError(res, `No stock found with id: ${_stockId}`);
    }
    let tradeExists = await Portfolio.findOne({ _stockId });
    if (tradeExists) {
        return badRequestError(res, 'This trade already exists');
    }
    let transaction = {
        stock: _stockId,
        type: 'buy',
        rate: stock.price,
        quantity
    };
    let saveCurrentTransaction = await saveTransaction(transaction);
    if (!saveCurrentTransaction) {
        return errorResponse(res, {}, 'Error in making a transaction', 422);
    }
    let portfolio = new Portfolio({
        average: stock.price,
        quantity,
        stock: _stockId,
    });
    let data, err;
    [err, data] = await to(portfolio.save());
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Trade successfully made');
}

/**
 * Updating a trade, and updating (buying more stocks) the portfolio accordingly.
 * @param {Request} req 
 * @param {Response} res 
 * @throws {badRequestError, notFoundError, errorResponse}
 * @api public
 * @returns {okResponse}
 */
const updateTrade = async (req, res) => {
    const portfolioId = req.params.id;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return badRequestError(res, 'Request expects a positive int param `quantity`');
    }
    let portfolioExists = await Portfolio.load(portfolioId);
    if (!portfolioExists) {
        return notFoundError(res, `No portfolio exists with id ${portfolioId}`);
    }
    let transaction = {
        stock: portfolioExists.stock._id,
        type: 'buy',
        rate: portfolioExists.stock.price,
        quantity
    };
    let saveCurrentTransaction = await saveTransaction(transaction);
    if (!saveCurrentTransaction) {
        return errorResponse(res, {}, 'Error in making a transaction', 422);
    }
    const currentAverage = portfolioExists.average,
        currentQuantity = +portfolioExists.quantity,
        currentStockPrice = portfolioExists.stock.price;
    const average = ((currentAverage * currentQuantity) + (currentStockPrice * quantity)) / (currentQuantity + +quantity);
    let updatedData = {
        average,
        quantity: currentQuantity + +quantity
    }
    let [err, _] = await to(Portfolio.findByIdAndUpdate(portfolioId, updatedData));
    if (err) return ReE(res, err, 422);
    Object.assign(portfolioExists, updatedData);
    return okResponse(res, portfolioExists, 'Portfolio updated successfully');
}

/**
 * Removing a trade from a portfolio (selling stocks from portfolio)
 * @param {Request} req 
 * @param {Response} res 
 * @throws {badRequestError, notFoundError, errorResponse}
 * @api public
 * @returns {okResponse}
 */
const removeTrade = async (req, res) => {
    const portfolioId = req.params.id;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return badRequestError(res, 'Request expects a positive int param `quantity`');
    }
    let portfolioExists = await Portfolio.load(portfolioId);
    if (!portfolioExists) {
        return notFoundError(res, `No portfolio exists with id ${portfolioId}`);
    }
    let transaction = {
        stock: portfolioExists.stock._id,
        type: 'sell',
        rate: portfolioExists.stock.price,
        quantity
    };
    let saveCurrentTransaction = await saveTransaction(transaction);
    if (!saveCurrentTransaction) {
        return errorResponse(res, {}, 'Error in making a transaction', 422);
    }

    let returns = portfolioExists.quantity * portfolioExists.average;
    let portfolio = {};
    if (+quantity > +portfolioExists.quantity) {
        return badRequestError(res, 'You don\'t have enough stocks to sell!!!');
    } else if (+quantity === +portfolioExists.quantity) {
        portfolio = await Portfolio.findByIdAndRemove(portfolioId);
    } else {
        let updatedData = {
            quantity: portfolioExists.quantity - quantity
        }
        portfolio = await Portfolio.findByIdAndUpdate(portfolioId, updatedData);
        Object.assign(Portfolio, updatedData);
    }
    return okResponse(res, { portfolio, returns }, 'Trade successfully removed');
}

/**
 * Fetching portfolio: all the securities and trades corresponding to it.
 * @param {Request} req 
 * @param {Response} res 
 * @throws {errorResponse}
 * @api public
 * @returns {okResponse}
 */
const fetchPortfolio = async (req, res) => {
    let [err, stocks] = await to(Stock.loadAll());
    if (err) return ReE(res, err, 422);
    stocks = JSON.parse(JSON.stringify(stocks));
    const portfolioPromise = await stocks.map(async v => {
        let p = await Portfolio.findOne({ stock: v._id });
        v.portfolio.push(p);
        return v;
    });
    let portfolios = await Promise.all(portfolioPromise);
    portfolios = JSON.parse(JSON.stringify(portfolios));
    const transactionPromise = await portfolios.map(async v => {
        let t = await Transaction.find({ stock: v._id });
        v.transaction.push(t);
        return v;
    });
    const transactions = await Promise.all(transactionPromise);
    return okResponse(res, { portfolio: transactions }, 'Successfully got the portfolio');
}

/**
 * An aggregate view of all securities in the portfolio with its final quantity and average buy price.
 * @param {Request} req 
 * @param {Response} res 
 * @throws {errorResponse}
 * @api public
 * @returns {okResponse}
 */
const getHoldings = async (req, res) => {
    let [err, portfolio] = await to(Portfolio.loadAll());
    if (err) return ReE(res, err, 422);
    let data = {
        portfolio: portfolio,
        returns: getProfit(portfolio)
    }
    return okResponse(res, data, 'Successfully got the holdings');
}

/**
 * This API call should respond with cumulative returns at any point of time of a particular portfolio.
 * @param {Request} req 
 * @param {Response} res 
 * @throws {errorResponse}
 * @api public
 * @returns {okResponse}
 */
const getReturns = async (req, res) => {
    let [err, portfolio] = await to(Portfolio.find());
    if (err) return ReE(res, err, 422);
    let sum = getProfit(portfolio);
    return okResponse(res, { returns: sum }, 'Successfully return the Total profit');
}

/**
 * Calculated the returns from portfolio: 
 * Formule: SUM((CURRENT_PRICE[ticker] - AVERAGE_BUY_PRICE[ticker]) * CURRENT_QUANTITY[ticker]) // CURRENT_PRICE[ticker] is assumed to be 1000 for all
 * @param {Portfolio Mode} portfolio 
 * @api private
 * @returns {Number}
 */
const getProfit = portfolio => {
    let sum = 0;
    portfolio.map(v => {
        sum += ((1000 - v.average) * v.quantity)
    });
    return sum;
}

/**
 * Method to save every transaction/trade which was made
 * @param {Transaction} transaction 
 * @api private
 * @returns { null || Object}
 */
const saveTransaction = async (transaction) => {
    let [err, data] = await to(Transaction.create(transaction));
    return err ? null : data;
};

module.exports = {
    getStocks,
    addStock,
    addTrade,
    updateTrade,
    removeTrade,
    fetchPortfolio,
    getHoldings,
    getReturns
}