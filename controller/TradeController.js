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
    req.body.transactionType = 'buy';
    await saveTransaction(req, res);
    let stock = await Stock.findById(stockId);
    let portfolio = new Portfolio({
        average: stock.price,
        quantity,
        _stockId: stockId
    });
    let data, err;
    [err, data] = await to(portfolio.save());
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Trade successfully made');
}

const updateTrade = async (req, res) => {

}

const removeTrade = async (req, res) => {

}

const fetchPortfolio = async (req, res) => {

}

const getHoldings = async (req, res) => {

}

const getReturns = async (req, res) => {

}

const saveTransaction = async (req, res) => {
    const { stockId, quantity, transactionType } = req.body;
    if (!stockId) {
        return badRequestError(res, 'Request expects param `StockId`');
    }
    if (!quantity && quantity > 0) {
        return badRequestError(res, 'Request expects a positive int param `quantity`');
    }
    let stock = await Stock.findById(stockId);
    if (!stock) {
        return notFoundError(res, `No stock found with id: ${stockId}`);
    }
    let transaction = {
        _stockId: stockId,
        type: transactionType,
        rate: stock.price,
        quantity
    };
    let err, data;
    [err, data] = await to(Transaction.save(transaction));
    if (err) return ReE(res, err, 422);
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