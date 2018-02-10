$(document).ready(function() {
  var h = 600, w = 1000,
  repoName = $('.commits-graph').attr('id'),
  inputDateDomain = dateDomain(commits),
  commitsByFrequency = commitFrequencies(commits),
  outputCommitDomain = [0, maxCommitsInDay(commitsByFrequency)],
  barWidth = w/daysBetween(inputDateDomain);

  $('input[class="daterange"]').daterangepicker(
    {
      locale: {
        format: 'YYYY-MM-DD'
      },
      startDate: dateDomain(commits)[0],
      endDate: dateDomain(commits)[1]
  },
  function(start, end, label) {
      // alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "commits",
        data: { since: String(start), until: String(end), repo: {name: String(repoName)} },
        dataType: "script",
        beforeSend: function() {
          $(".commits-graph").addClass('loadingDiv');
        },
        success: function (result) {
            $(".commits-graph").removeClass('loadingDiv');
         },
         error: function (){
            window.alert("something wrong!");
         }
      });
  });

  renderGraphCanvas(h, w);

  var barHeight = d3.scale.linear()
      .domain(outputCommitDomain)
      .range([0, h]);


  // this gives us an output from 0 to one less than the number
  // of days from first to last commit, this ensures scale
  // starting at zero, but with correct number of indecies
  var barIndex = d3.time.scale()
    .domain(inputDateDomain)
    .range([0, daysBetween(inputDateDomain) - 1]);

  // map bar indecies to x positions
  var barPosition = d3.scale.linear()
    .domain([0, daysBetween(inputDateDomain)])
    .range([0, w]);

  var canvas = d3.select('#graph-canvas');

  canvas.selectAll('rect')
    .data(commitsByFrequency)
    .enter()
    .append('rect')
    .attr('width',barWidth)
    .attr('height', function(data, index){
      return barHeight(data.length);
    })
    .attr('x', function(data, index){
      var date = commitDate(data[0]),
          index = barIndex(date),
          pos = barPosition(index);
      return pos;
    })
    .attr('y', function(data, index){
      return h - barHeight(data.length);
    })
    .on('mouseenter', function(data){
      $("#bar-info").html(data.length + " Commits on " + commitDate(data[0]));
    });
});


// returns earliest and latests dats from array of commits
function dateDomain(commits) {
  var i = 0, length = commits.length,
  min = commitDate(commits[0]),
  max = min, date;

  for(; i < length ;) {
    date = commitDate(commits[i]);
    if(date > max) {
      max = date;
    } else if (date < min) {
      min = date;
    }
    i += 1;
  }
  return [min,max];
}

// returns commits arranged by day when given commits
function commitFrequencies(commits) {
  var byDateObj = {}, i = 0, length = commits.length,
    max = 0, date, byDateArray = [];

  for(;i<length;) {
    date = commitDate(commits[i]);
    byDateObj[date] = byDateObj[date] || [];
    byDateObj[date].push(commits[i]);
    i += 1;
  }

  for(var key in byDateObj) {
    byDateArray.push( byDateObj[key] );
  }
  return byDateArray;
}

function maxCommitsInDay(commitsByFrequency) {
  var i = 0; length = commitsByFrequency.length, max = 0,
  commitsInDay = 0;
    for(; i < length;) {
      commitsInDay = commitsByFrequency[i].length
      if(commitsInDay > max){
        max = commitsInDay;
      }
      i += 1;
    }
  return max;
}

// returns date of commit if passed github commit
function commitDate(commit) {
  var commitString = commit['commit']['committer']['date'],
  dateArray = commitString.split('T')[0].split('-')
  return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
}

// difference in number of days between commits
function daysBetween(minMaxArray) {
  var milliseconds = minMaxArray[1] - minMaxArray[0];
  return parseInt(milliseconds* 1.15741E-8, 10) + 1;
}

// create a canvas for our graph
function renderGraphCanvas(h, w) {
  var svg = d3.select('#graph-wrapper')
    .append('svg')
    .attr('id', 'graph-canvas')
    .attr('height', h)
    .attr('width', w)
    .style('border', '2px solid black');
}
