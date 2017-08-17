package com.stocks.api;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class StockService {

  private StockRepository stockRepository;

  @Autowired
  public StockService(StockRepository stockRepository) {
    this.stockRepository = stockRepository;
  }

  public Page<Stock> fetchAll(Pageable pageable) {
    return stockRepository.findAll(pageable);
  }

  public Page<Stock> fetchAllByName(String name, Pageable pageable) {
    return stockRepository.findAllByNameIgnoreCaseContaining(name, pageable);
  }

  public String fetchHistorical(String symbol, String startDate, String endDate) {
    if (symbol == null) {
      return null;
    }

    if (startDate != null && endDate == null) {
      endDate = getDefaultEndDate();
    } else if (startDate == null || endDate == null) {
      startDate = getDefaultStartDate();
      endDate = getDefaultEndDate();
    }

    String url = "https://quantprice.herokuapp.com/api/v1.1/scoop/period?tickers=" + symbol
        + "&begin=" + startDate + "&end=" + endDate;
    RestTemplate restTemplate = new RestTemplate();
    String response = restTemplate.getForObject(url, String.class);
    return response;
  }

  private static DateFormat getDateFormat() {
    return new SimpleDateFormat("yyyy-MM-dd");
  }

  private String getDefaultStartDate() {
    return getDateFormat()
        .format(Date.from(LocalDateTime.now().minusDays(30).toInstant(ZoneOffset.UTC)));
  }

  private String getDefaultEndDate() {
    return getDateFormat().format(Date.from(LocalDateTime.now().toInstant(ZoneOffset.UTC)));
  }

}
