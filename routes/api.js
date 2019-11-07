'use strict';

const express = require('express');
const router = express.Router();
const Trade = require('../controller/TradeController');

/***********************
  Stock Routes
***********************/
router.get('/stock', Trade.getStocks);
router.post('/stock', Trade.addStock);
/***********************
  Stock Routes
***********************/

/***********************
  Trade Routes
***********************/
router.post('/trade', Trade.addTrade);
router.put('/trade/:id', Trade.updateTrade);
router.delete('/trade/:id', Trade.removeTrade);
router.get('/portfolio', Trade.fetchPortfolio);
router.get('/holdings', Trade.getHoldings);
router.get('/returns', Trade.getReturns);
/***********************
  Trade Routes
***********************/

module.exports = router;