/// Timeseries chart example
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/remote/dto/time_value.dart';

class SimpleTimeSeriesChart extends StatelessWidget {
  final List<charts.Series<TimeValue, DateTime>> seriesList;

  SimpleTimeSeriesChart(this.seriesList);

  @override
  Widget build(BuildContext context) {
    return new charts.TimeSeriesChart(
      seriesList,
      animate: false,
      dateTimeFactory: const charts.LocalDateTimeFactory(),
    );
  }
}
