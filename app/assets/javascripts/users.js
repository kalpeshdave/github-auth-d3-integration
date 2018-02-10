
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
