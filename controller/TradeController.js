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
    let stock = new Stock({ name, price });
    let data, err;
    [err, data] = await to(stock.save());
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Stock created successfully');
}

const addTrade = async (req, res) => {
    const { _stockId, quantity } = req.body;
    if (!_stockId) {
        return badRequestError(res, 'Request expects param `StockId`');
    }
    if (!quantity && quantity > 0) {
        return badRequestError(res, 'Request expects a positive int param `quantity`');
    }
    let stock = await Stock.findById(_stockId);
    if (!stock) {
        return notFoundError(res, `No stock found with id: ${_stockId}`);
    }
    let transaction = {
        _stockId,
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
        _stockId
    });
    let data, err;
    [err, data] = await to(portfolio.save());
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Trade successfully made');
}

const updateTrade = async (req, res) => {

}

const removeTrade = async (req, res) => {
    req.body.transactionType = 'sell';
    await saveTransaction(req, res);
    let portfolioId = req.params.id;
    let stock = await Stock.findById(stockId);
    let portfolio = await Portfolio.findById(portfolioId).populate('Stock');
    let returns = portfolio.quantity * portfolio.average;
    let data, err;
    [err, data] = await to(portfolio.save());
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Trade successfully made');
}

const fetchPortfolio = async (req, res) => {

}

const getHoldings = async (req, res) => {

}

const getReturns = async (req, res) => {

}

const saveTransaction = async (transaction) => {
    let err, data;
    [err, data] = await to(new Transaction(transaction).save(transaction));
    if (err) return null;
    return data;
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