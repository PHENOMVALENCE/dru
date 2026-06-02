/* ============================================
   Charts.js - Data Visualizations
   Using Chart.js library
   ============================================ */

// Chart.js global configuration for dark theme
Chart.defaults.color = '#94A3B8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// Color palette
const chartColors = {
    accent: '#00D4FF',
    accentSecondary: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    pink: '#EC4899'
};

// ============================================
// Radar Chart - Skill Proficiency
// ============================================
function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    
    if (!ctx) return;
    
    const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Excel',
                'Data Cleaning',
                'Visualization',
                'Communication',
                'Problem Solving',
                'Time Management'
            ],
            datasets: [{
                label: 'Proficiency',
                data: [85, 75, 70, 90, 80, 85],
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                borderColor: chartColors.accent,
                borderWidth: 2,
                pointBackgroundColor: chartColors.accent,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: chartColors.accent,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#F8FAFC',
                    bodyColor: '#94A3B8',
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Proficiency: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#64748B',
                        backdropColor: 'transparent',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#94A3B8',
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    return radarChart;
}

// ============================================
// Doughnut Chart - Project Distribution
// ============================================
function initDoughnutChart() {
    const ctx = document.getElementById('doughnutChart');
    
    if (!ctx) return;
    
    const doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Data Analysis',
                'Operations',
                'Leadership',
                'Business',
                'Education'
            ],
            datasets: [{
                data: [35, 25, 20, 10, 10],
                backgroundColor: [
                    chartColors.accent,
                    chartColors.accentSecondary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.pink
                ],
                borderColor: '#0B0F19',
                borderWidth: 3,
                hoverBorderColor: '#1F2937',
                hoverBorderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94A3B8',
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#F8FAFC',
                    bodyColor: '#94A3B8',
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    return doughnutChart;
}

// ============================================
// Bar Chart - Project Success Metrics
// ============================================
function initBarChart() {
    const ctx = document.getElementById('barChart');
    
    if (!ctx) return;
    
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Excel Dashboards',
                'Data Cleaning',
                'Visualization',
                'Customer Service',
                'Team Engagement'
            ],
            datasets: [{
                label: 'Proficiency / Success Rate (%)',
                data: [85, 75, 70, 90, 65],
                backgroundColor: [
                    createGradient(ctx, chartColors.accent, chartColors.accentSecondary),
                    createGradient(ctx, chartColors.accentSecondary, chartColors.pink),
                    createGradient(ctx, chartColors.success, chartColors.accent),
                    createGradient(ctx, chartColors.warning, chartColors.danger),
                    createGradient(ctx, chartColors.info, chartColors.accentSecondary)
                ],
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#F8FAFC',
                    bodyColor: '#94A3B8',
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `Success Rate: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94A3B8',
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#64748B',
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    return barChart;
}

// Helper function to create gradients
function createGradient(ctx, color1, color2) {
    const canvas = ctx.canvas || ctx;
    const chartArea = canvas.getContext ? canvas.getContext('2d') : ctx.ctx;
    
    if (!chartArea) {
        return color1;
    }
    
    const gradient = chartArea.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    return gradient;
}

// ============================================
// Initialize Charts on Page Load
// ============================================
let radarChart, doughnutChart, barChart;
let chartsInitialized = false;

function initializeAllCharts() {
    if (chartsInitialized) return;
    
    radarChart = initRadarChart();
    doughnutChart = initDoughnutChart();
    barChart = initBarChart();
    
    chartsInitialized = true;
}

// Initialize charts when they come into view
const chartContainers = document.querySelectorAll('.chart-wrapper, .chart-card');

const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initializeAllCharts();
            chartObserver.disconnect();
        }
    });
}, { threshold: 0.2 });

chartContainers.forEach(container => {
    chartObserver.observe(container);
});

// Fallback: Initialize on DOM ready if charts are visible
document.addEventListener('DOMContentLoaded', function() {
    // Delay initialization to ensure canvas elements are ready
    setTimeout(() => {
        if (!chartsInitialized) {
            const radarCanvas = document.getElementById('radarChart');
            const doughnutCanvas = document.getElementById('doughnutChart');
            const barCanvas = document.getElementById('barChart');
            
            // Check if any chart is in viewport
            if (radarCanvas || doughnutCanvas || barCanvas) {
                const rect = (radarCanvas || doughnutCanvas || barCanvas).getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    initializeAllCharts();
                }
            }
        }
    }, 500);
});

// ============================================
// Chart Resize Handler
// ============================================
let resizeTimeout;

window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (radarChart) radarChart.resize();
        if (doughnutChart) doughnutChart.resize();
        if (barChart) barChart.resize();
    }, 250);
});

// ============================================
// Export for use in other modules (optional)
// ============================================
window.chartFunctions = {
    initRadarChart,
    initDoughnutChart,
    initBarChart,
    initializeAllCharts
};
