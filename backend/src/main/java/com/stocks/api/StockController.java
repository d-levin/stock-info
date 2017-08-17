package com.stocks.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("stocks")
public class StockController {

  private StockService stockService;

  @Autowired
  public StockController(StockService stockService) {
    this.stockService = stockService;
  }

  @GetMapping
  public Page<Stock> fetchAll(Pageable pageable) {
    return stockService.fetchAll(pageable);
  }

  @GetMapping("search")
  public Page<Stock> fetchAllWithSearch(Pageable pageable, @RequestParam String name) {
    return stockService.fetchAllByName(name, pageable);
  }

  @GetMapping(value = "historical", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> fetchHistorical(@RequestParam String symbol,
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate) {
    return ResponseEntity.ok(stockService.fetchHistorical(symbol, startDate, endDate));
  }

}
