'use strict';

const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');
const Portfolio = mongoose.model('Portfolio');
const Transaction = mongoose.model('Transaction');

const addStock = async (req, res) => {
    const { name, price } = req.body;
    let stock = new Stock({ name, price });
    let data, err;
    [err, data] = await to(stock.save());
    if (err) return ReE(res, err, 422);
    return createdResponse(res, data, 'Stock created successfully');
}

const addTrade = async (req, res) => {

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

module.exports = {
    addStock,
    addTrade,
    updateTrade,
    removeTrade,
    fetchPortfolio,
    getHoldings,
    getReturns
}