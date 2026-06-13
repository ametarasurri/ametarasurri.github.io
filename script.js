/* ============================
   JavaScript — Indian Startup Funding Analysis
   Charts, Animations, Interactivity
   ============================ */

// ============ Navigation ============
const nav = document.getElementById('main-nav');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
});

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============ Counter Animation ============
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Start counters when hero is visible
const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-number[data-count]').forEach(animateCounter);
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

heroObserver.observe(document.getElementById('hero'));

// ============ Scroll Reveal ============
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ============ Query Tabs ============
const queryTabs = document.querySelectorAll('.query-tab');
const queryPanels = document.querySelectorAll('.query-panel');
let chartsInitialized = { 1: false, 2: false, 3: false, 4: false, 5: false };

queryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const queryNum = tab.dataset.query;

        queryTabs.forEach(t => t.classList.remove('active'));
        queryPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById('query-' + queryNum).classList.add('active');

        // Initialize charts on first view
        if (!chartsInitialized[queryNum]) {
            initChart(parseInt(queryNum));
            chartsInitialized[queryNum] = true;
        }
    });
});

// ============ SQL Toggle ============
document.querySelectorAll('.toggle-sql-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        target.classList.toggle('collapsed');
        const isCollapsed = target.classList.contains('collapsed');
        btn.innerHTML = isCollapsed
            ? '<span class="code-icon">&lt;/&gt;</span> View SQL'
            : '<span class="code-icon">&lt;/&gt;</span> Hide SQL';
    });
});

// ============ Chart.js Config ============
const chartColors = {
    blue: '#638cff',
    purple: '#a855f7',
    cyan: '#22d3ee',
    green: '#34d399',
    orange: '#fb923c',
    pink: '#f472b6',
    red: '#ef4444',
    yellow: '#fbbf24',
    slate: '#64748b',
    indigo: '#818cf8',
};

const chartFont = {
    family: "'Inter', sans-serif",
    size: 12,
    weight: 500
};

Chart.defaults.color = '#8892a8';
Chart.defaults.font = chartFont;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
Chart.defaults.plugins.legend.labels.padding = 16;

function getGridColor() { return 'rgba(99, 115, 175, 0.1)'; }
function getBorderColor() { return 'rgba(99, 115, 175, 0.15)'; }

// ============ Initialize Charts ============
function initChart(num) {
    switch (num) {
        case 1: initCityCharts(); break;
        case 2: initSectorChart(); break;
        case 4: initMoMChart(); break;
        case 5: initStageChart(); break;
    }
}

// --- Chart 1: City Deals & Funding ---
function initCityCharts() {
    const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Gurgaon', 'Pune', 'Hyderabad', 'Chennai', 'Noida', 'Ahmedabad', 'Jaipur'];
    const deals = [841, 567, 456, 337, 105, 99, 97, 92, 38, 30];
    const funding = [18.46, 4.92, 3.29, 3.87, 0.63, 0.40, 0.72, 1.26, 0.11, 0.15];

    const colorPalette = [
        chartColors.blue, chartColors.purple, chartColors.cyan, chartColors.green,
        chartColors.orange, chartColors.pink, chartColors.yellow, chartColors.indigo,
        chartColors.red, chartColors.slate
    ];

    new Chart(document.getElementById('chart-city-deals'), {
        type: 'bar',
        data: {
            labels: cities,
            datasets: [{
                label: 'Total Deals',
                data: deals,
                backgroundColor: colorPalette.map(c => c + '33'),
                borderColor: colorPalette,
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Deals by City',
                    font: { size: 14, weight: 700 },
                    padding: { bottom: 16 }
                },
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 26, 0.95)',
                    borderColor: 'rgba(99, 140, 255, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { color: getBorderColor() },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    grid: { color: getGridColor() },
                    border: { display: false },
                    beginAtZero: true
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            }
        }
    });

    new Chart(document.getElementById('chart-city-funding'), {
        type: 'doughnut',
        data: {
            labels: cities,
            datasets: [{
                data: funding,
                backgroundColor: colorPalette.map(c => c + '99'),
                borderColor: colorPalette,
                borderWidth: 2,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
                title: {
                    display: true,
                    text: 'Funding Distribution ($B)',
                    font: { size: 14, weight: 700 },
                    padding: { bottom: 16 }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 10 },
                        padding: 10,
                        generateLabels: (chart) => {
                            const data = chart.data;
                            return data.labels.slice(0, 5).map((label, i) => ({
                                text: label,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].borderColor[i],
                                lineWidth: 1.5,
                                hidden: false,
                                index: i,
                                pointStyle: 'circle'
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 26, 0.95)',
                    borderColor: 'rgba(99, 140, 255, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: $${ctx.parsed}B`
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1400,
                easing: 'easeOutQuart'
            }
        }
    });
}

// --- Chart 2: Sector Trends ---
function initSectorChart() {
    const years = ['2016', '2017', '2018', '2019'];

    const sectors = {
        'Consumer Internet': { data: [539, 309, 92, 5], color: chartColors.blue },
        'Technology': { data: [190, 223, 62, 4], color: chartColors.purple },
        'E-Commerce': { data: [166, 96, 20, 19], color: chartColors.cyan },
        'Finance': { data: [30, 40, 37, 8], color: chartColors.green },
        'FinTech': { data: [15, 20, 25, 8], color: chartColors.orange },
        'Healthcare': { data: [40, 35, 25, 5], color: chartColors.pink },
    };

    const datasets = Object.entries(sectors).map(([name, info]) => ({
        label: name,
        data: info.data,
        borderColor: info.color,
        backgroundColor: info.color + '18',
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: info.color,
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true,
    }));

    new Chart(document.getElementById('chart-sector-trends'), {
        type: 'line',
        data: { labels: years, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top Sector Deal Volume by Year',
                    font: { size: 14, weight: 700 },
                    padding: { bottom: 16 }
                },
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 11 },
                        padding: 14,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 26, 0.95)',
                    borderColor: 'rgba(99, 140, 255, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} deals`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: getGridColor() },
                    border: { color: getBorderColor() }
                },
                y: {
                    grid: { color: getGridColor() },
                    border: { display: false },
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Deals',
                        font: { size: 11, weight: 600 }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// --- Chart 4: Month over Month ---
function initMoMChart() {
    // Monthly funding data (approximated from query results)
    const labels = [
        'Jan 16', 'Feb 16', 'Mar 16', 'Apr 16', 'May 16', 'Jun 16',
        'Jul 16', 'Aug 16', 'Sep 16', 'Oct 16', 'Nov 16', 'Dec 16',
        'Jan 17', 'Feb 17', 'Mar 17', 'Apr 17', 'May 17', 'Jun 17',
        'Jul 17', 'Aug 17', 'Sep 17', 'Oct 17', 'Nov 17', 'Dec 17',
        'Jan 18', 'Feb 18', 'Mar 18', 'Apr 18', 'May 18', 'Jun 18',
        'Jul 18', 'Aug 18', 'Sep 18', 'Oct 18', 'Nov 18', 'Dec 18',
        'Jan 19', 'Feb 19', 'Mar 19', 'Apr 19', 'May 19', 'Jun 19',
        'Jul 19', 'Aug 19', 'Sep 19', 'Oct 19', 'Nov 19', 'Dec 19'
    ];

    const fundingData = [
        0.35, 0.28, 0.45, 0.52, 0.38, 0.41,
        0.55, 0.62, 0.48, 0.33, 0.29, 0.25,
        0.30, 0.22, 1.71, 0.55, 0.42, 0.65,
        0.18, 2.91, 0.35, 0.45, 0.52, 0.38,
        0.65, 0.82, 0.95, 1.10, 0.75, 0.88,
        0.62, 0.70, 0.55, 0.05, 0.12, 0.15,
        0.22, 0.18, 0.35, 0.28, 0.40, 0.32,
        0.15, 2.26, 0.35, 0.28, 0.22, 0.18
    ];

    const dealData = [
        85, 72, 95, 110, 88, 92,
        105, 115, 98, 78, 65, 58,
        70, 55, 82, 95, 78, 88,
        62, 75, 68, 82, 90, 72,
        42, 55, 48, 52, 45, 50,
        38, 42, 35, 22, 18, 15,
        12, 10, 15, 12, 18, 14,
        8, 10, 12, 10, 8, 6
    ];

    new Chart(document.getElementById('chart-mom-trends'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Funding ($B)',
                    data: fundingData,
                    backgroundColor: fundingData.map(v =>
                        v > 2 ? chartColors.green + '99' :
                        v > 1 ? chartColors.blue + '66' :
                        chartColors.blue + '33'
                    ),
                    borderColor: fundingData.map(v =>
                        v > 2 ? chartColors.green :
                        v > 1 ? chartColors.blue :
                        chartColors.blue + '88'
                    ),
                    borderWidth: 1,
                    borderRadius: 3,
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'Deal Count',
                    data: dealData,
                    type: 'line',
                    borderColor: chartColors.orange,
                    backgroundColor: chartColors.orange + '15',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: chartColors.orange,
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y1',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Funding & Deal Count (2016–2019)',
                    font: { size: 14, weight: 700 },
                    padding: { bottom: 16 }
                },
                legend: {
                    position: 'top',
                    labels: { font: { size: 11 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 26, 0.95)',
                    borderColor: 'rgba(99, 140, 255, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { color: getBorderColor() },
                    ticks: {
                        maxRotation: 45,
                        font: { size: 9 },
                        callback: function(val, index) {
                            return index % 3 === 0 ? this.getLabelForValue(val) : '';
                        }
                    }
                },
                y: {
                    position: 'left',
                    grid: { color: getGridColor() },
                    border: { display: false },
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Funding ($B)',
                        font: { size: 11, weight: 600 }
                    }
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    border: { display: false },
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Deal Count',
                        font: { size: 11, weight: 600 }
                    }
                }
            },
            animation: {
                duration: 1800,
                easing: 'easeOutQuart'
            }
        }
    });
}

// --- Chart 5: Stage Analysis ---
function initStageChart() {
    const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Gurgaon', 'Hyderabad', 'Pune', 'Chennai', 'Noida'];
    const lateStage = [417, 280, 0, 164, 0, 0, 53, 0];
    const earlyStage = [0, 0, 273, 0, 60, 58, 0, 50];
    const lateFunding = [14.19, 4.41, 0, 3.54, 0, 0, 0.67, 0];
    const earlyFunding = [0, 0, 0.29, 0, 0.06, 0.11, 0, 0.06];

    new Chart(document.getElementById('chart-stage'), {
        type: 'bar',
        data: {
            labels: cities,
            datasets: [
                {
                    label: 'Late Stage Deals',
                    data: lateStage,
                    backgroundColor: chartColors.purple + '55',
                    borderColor: chartColors.purple,
                    borderWidth: 1.5,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Early Stage Deals',
                    data: earlyStage,
                    backgroundColor: chartColors.green + '55',
                    borderColor: chartColors.green,
                    borderWidth: 1.5,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Dominant Investment Stage by City',
                    font: { size: 14, weight: 700 },
                    padding: { bottom: 16 }
                },
                legend: {
                    position: 'top',
                    labels: { font: { size: 11 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 26, 0.95)',
                    borderColor: 'rgba(99, 140, 255, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: function(ctx) {
                            if (ctx.parsed.y === 0) return null;
                            const fundingArr = ctx.datasetIndex === 0 ? lateFunding : earlyFunding;
                            return ` ${ctx.dataset.label}: ${ctx.parsed.y} deals ($${fundingArr[ctx.dataIndex]}B)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { color: getBorderColor() },
                    stacked: true,
                },
                y: {
                    grid: { color: getGridColor() },
                    border: { display: false },
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Deals',
                        font: { size: 11, weight: 600 }
                    }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Initialize first chart on load
window.addEventListener('DOMContentLoaded', () => {
    // Observe when queries section becomes visible
    const querySection = document.getElementById('queries');
    const queryObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !chartsInitialized[1]) {
            initChart(1);
            chartsInitialized[1] = true;
            queryObserver.disconnect();
        }
    }, { threshold: 0.1 });
    queryObserver.observe(querySection);
});
