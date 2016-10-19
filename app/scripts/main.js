/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
import * as d3 from 'd3';

(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  // Then we instantiate a client with or without a token (as show in a later section)
  let data = [];
  let tasks = [];
  // let taskNames = [];
  // let taskStatus = {
  //   SUCCEEDED: 'bar',
  //   FAILED: 'bar-failed',
  //   RUNNING: 'bar-running',
  //   KILLED: 'bar-killed'
  // };
  // var format = '%H:%M';
  // var timeDomainString = '1day';

  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        let repos = JSON.parse(httpRequest.responseText);
        for (let repo of repos) {
          tasks.push({
            startDate: new Date(repo.created_at),
            endDate: new Date(repo.pushed_at),
            taskName: repo.name, status: 'RUNNING'
          });
          // taskNames.push(repo.name);
          data.push({size: repo.size, name: repo.name});
        }
        var x = d3.scale.linear()
          .domain([0, d3.max(data.map(d => d.size))])
          .range([0, 420]);
        d3.select('.chart')
          .selectAll('div')
          .data(data)
          .enter().append('div')
          .style('width', function(d) {
            return x(d.size) + 'px';
          });
          // .text(function(d) { return d.name; });

        // tasks.sort(function(a, b) {
        //   return a.endDate - b.endDate;
        // });
        // // var maxDate = tasks[tasks.length - 1].endDate;
        // tasks.sort(function(a, b) {
        //   return a.startDate - b.startDate;
        // });
        // var minDate = tasks[0].startDate;
        // var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus)
        //   .tickFormat(format).height(450).width(800);
        // gantt.timeDomainMode('fixed');
        // // changeTimeDomain(timeDomainString);
        // gantt(tasks);
      } else {
        console.error('There was a problem with the request.');
      }
    }
  };
  httpRequest.open('GET', 'https://api.github.com/users/iraquitan/repos', true);
  httpRequest.send(null);

  // Bar chart tutorial
  let chartCard = d3.select('#overview')
    .insert('section', ':first-child')
    // .append('section')
    .attr('class',
      'section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp')
    .append('div')
    .attr('class', 'mdl-card mdl-cell mdl-cell--12-col')
    .append('div')
    .attr('class', 'mdl-card__supporting-text');

  chartCard
    .append('h4')
    .text('Bar chart');
  chartCard
    .append('div')
    .attr('class', 'chart');
})();
