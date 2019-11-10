'use strict';

const express = require('express');
const router = express.Router();
const { getStocks,
  addStock,
  addTrade,
  updateTrade,
  removeTrade,
  fetchPortfolio,
  getHoldings,
  getReturns } = require('../controller/TradeController');

/***********************
  Stock Routes
***********************/
router.get('/stock', getStocks);
router.post('/stock', addStock);
/***********************
  Stock Routes
***********************/

/***********************
  Trade Routes
***********************/
router.post('/trade', addTrade);
router.put('/trade/:id', updateTrade);
router.delete('/trade/:id', removeTrade);
router.get('/portfolio', fetchPortfolio);
router.get('/holdings', getHoldings);
router.get('/returns', getReturns);
/***********************
  Trade Routes
***********************/

module.exports = router;