'use strict';

const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');
const Portfolio = mongoose.model('Portfolio');
const Transaction = mongoose.model('Transaction');

const getStocks = async (req, res) => {
    let err, stocks;
    [err, stocks] = await to(Stock.find());
    if (err) return ReE(res, err, 422);
    return successResponse(res, 200, stocks, 'Stocks fetched successfully.');
}

const addStock = async (req, res) => {
    const { name, price } = req.body;
    let data, err;
    [err, data] = await to(Stock.create({ name, price }));
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Stock created successfully');
}

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

const fetchPortfolio = async (req, res) => {
    let [err, portfolio] = await to(Stock.loadAll());
    if (err) return ReE(res, err, 422);
    return okResponse(res, portfolio, 'Successfully got the portfolio');
}

const getHoldings = async (req, res) => {
    let [err, portfolio] = await to(Portfolio.loadAll());
    if (err) return ReE(res, err, 422);
    return okResponse(res, portfolio, 'Successfully got the holdings');
}

const getReturns = async (req, res) => {

}

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