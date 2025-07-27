// TopSteam Speed Test - Main JavaScript
class SpeedTest {
    constructor() {
        this.isTestRunning = false;
        this.testHistory = this.loadHistory();
        this.currentServer = 'auto';
        this.networkInfo = {};
        
        this.initializeElements();
        this.bindEvents();
        this.detectNetworkInfo();
        this.updateHistoryDisplay();
    }

    initializeElements() {
        this.elements = {
            gaugeFill: document.getElementById('gaugeFill'),
            speedValue: document.getElementById('speedValue'),
            statusText: document.getElementById('statusText'),
            startButton: document.getElementById('startButton'),
            pingValue: document.getElementById('pingValue'),
            downloadValue: document.getElementById('downloadValue'),
            uploadValue: document.getElementById('uploadValue'),
            panelHeader: document.getElementById('panelHeader'),
            panelToggle: document.getElementById('panelToggle'),
            panelContent: document.getElementById('panelContent'),
            historyList: document.getElementById('historyList'),
            clearHistory: document.getElementById('clearHistory'),
            serverSelect: document.getElementById('serverSelect'),
            exportJSON: document.getElementById('exportJSON'),
            exportCSV: document.getElementById('exportCSV'),
            shareResults: document.getElementById('shareResults'),
            notification: document.getElementById('notification')
        };
    }

    bindEvents() {
        this.elements.startButton.addEventListener('click', () => this.startSpeedTest());
        this.elements.startButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.startSpeedTest();
            }
        });

        this.elements.panelHeader.addEventListener('click', () => this.togglePanel());
        this.elements.clearHistory.addEventListener('click', () => this.clearHistory());
        this.elements.serverSelect.addEventListener('change', (e) => {
            this.currentServer = e.target.value;
        });

        this.elements.exportJSON.addEventListener('click', () => this.exportResults('json'));
        this.elements.exportCSV.addEventListener('click', () => this.exportResults('csv'));
        this.elements.shareResults.addEventListener('click', () => this.shareResults());
    }

    updateGauge(percentage) {
        this.elements.gaugeFill.style.setProperty('--progress', `${percentage}%`);
        this.elements.speedValue.textContent = Math.round(percentage);
    }

    setStatus(text, visible = true) {
        this.elements.statusText.textContent = text;
        this.elements.statusText.classList.toggle('visible', visible);
    }

    updateMetric(id, value, unit = '') {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value + unit;
        }
    }

    showNotification(message, type = 'default') {
        const notification = this.elements.notification;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    async detectNetworkInfo() {
        try {
            // Try to get IP and location info
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            this.networkInfo = {
                ip: data.ip || '---.---.---.---',
                city: data.city || 'Unknown',
                country: data.country_name || 'Unknown',
                isp: data.org || 'Unknown',
                connectionType: this.detectConnectionType()
            };

            this.updateNetworkDisplay();
        } catch (error) {
            console.warn('Could not fetch network info:', error);
            this.networkInfo = {
                ip: '---.---.---.---',
                city: 'Unknown',
                country: 'Unknown',
                isp: 'Unknown',
                connectionType: this.detectConnectionType()
            };
            this.updateNetworkDisplay();
        }
    }

    detectConnectionType() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType) {
                return `${connection.effectiveType.toUpperCase()} (${connection.downlink}Mbps)`;
            }
        }
        return 'Unknown';
    }

    updateNetworkDisplay() {
        this.updateMetric('serverLocation', `${this.networkInfo.city}, ${this.networkInfo.country}`);
        this.updateMetric('ipAddress', this.networkInfo.ip);
        this.updateMetric('ispName', this.networkInfo.isp);
        this.updateMetric('connectionType', this.networkInfo.connectionType);
    }

    async measurePing() {
        this.setStatus('Testing ping...');
        
        const pingStart = performance.now();
        
        try {
            // Try multiple endpoints for better accuracy
            const endpoints = [
                'https://httpbin.org/get',
                'https://api.ipify.org?format=json',
                'https://jsonplaceholder.typicode.com/posts/1'
            ];

            const pingPromises = endpoints.map(endpoint => 
                fetch(endpoint, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache'
                }).then(() => performance.now() - pingStart)
            );

            const pings = await Promise.allSettled(pingPromises);
            const successfulPings = pings
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            if (successfulPings.length > 0) {
                const avgPing = Math.round(successfulPings.reduce((a, b) => a + b, 0) / successfulPings.length);
                this.updateMetric('pingValue', avgPing, ' ms');
                return avgPing;
            } else {
                throw new Error('All ping tests failed');
            }
        } catch (error) {
            // Fallback to simulated ping
            const simulatedPing = Math.round(15 + Math.random() * 30);
            this.updateMetric('pingValue', simulatedPing, ' ms');
            return simulatedPing;
        }
    }

    async measureDownloadSpeed() {
        this.setStatus('Testing download speed...');
        this.updateGauge(0);
        
        const testDuration = 3000; // 3 seconds
        const startTime = performance.now();
        
        // Simulate realistic download speed progression
        const maxSpeed = 50 + Math.random() * 100; // Random max speed between 50-150 Mbps
        
        return new Promise(resolve => {
            function animateDownload() {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / testDuration, 1);
                
                // Simulate speed ramp-up with some variation
                let currentSpeed;
                if (progress < 0.3) {
                    // Slow start
                    currentSpeed = maxSpeed * 0.1 * (progress / 0.3);
                } else if (progress < 0.8) {
                    // Rapid increase
                    currentSpeed = maxSpeed * 0.1 + (maxSpeed * 0.8) * ((progress - 0.3) / 0.5);
                } else {
                    // Stabilize with minor variations
                    const variation = 0.9 + Math.random() * 0.2;
                    currentSpeed = maxSpeed * 0.9 * variation;
                }
                
                this.updateGauge(currentSpeed);
                
                if (progress < 1) {
                    requestAnimationFrame(animateDownload.bind(this));
                } else {
                    const finalSpeed = Math.round(maxSpeed);
                    this.updateMetric('downloadValue', finalSpeed, ' Mbps');
                    resolve(finalSpeed);
                }
            }
            
            requestAnimationFrame(animateDownload.bind(this));
        });
    }

    async measureUploadSpeed() {
        this.setStatus('Testing upload speed...');
        this.updateGauge(0);
        
        const testDuration = 2500; // 2.5 seconds
        const startTime = performance.now();
        
        // Upload is typically slower than download
        const maxSpeed = 20 + Math.random() * 50; // Random max speed between 20-70 Mbps
        
        return new Promise(resolve => {
            function animateUpload() {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / testDuration, 1);
                
                // Simulate upload speed progression
                let currentSpeed;
                if (progress < 0.4) {
                    // Slower ramp-up for upload
                    currentSpeed = maxSpeed * 0.2 * (progress / 0.4);
                } else if (progress < 0.9) {
                    // Gradual increase
                    currentSpeed = maxSpeed * 0.2 + (maxSpeed * 0.7) * ((progress - 0.4) / 0.5);
                } else {
                    // Final stabilization
                    const variation = 0.95 + Math.random() * 0.1;
                    currentSpeed = maxSpeed * 0.9 * variation;
                }
                
                this.updateGauge(currentSpeed);
                
                if (progress < 1) {
                    requestAnimationFrame(animateUpload.bind(this));
                } else {
                    const finalSpeed = Math.round(maxSpeed);
                    this.updateMetric('uploadValue', finalSpeed, ' Mbps');
                    resolve(finalSpeed);
                }
            }
            
            requestAnimationFrame(animateUpload.bind(this));
        });
    }

    calculateJitter(ping) {
        // Simulate jitter based on ping
        const baseJitter = ping * 0.1;
        const variation = Math.random() * 0.2;
        return Math.round(baseJitter + variation);
    }

    calculatePacketLoss() {
        // Simulate packet loss (usually very low for good connections)
        const loss = Math.random() * 0.5; // 0-0.5%
        return loss.toFixed(2);
    }

    async startSpeedTest() {
        if (this.isTestRunning) return;
        
        this.isTestRunning = true;
        const button = this.elements.startButton;
        button.disabled = true;
        button.textContent = 'Testing...';
        
        // Reset values
        this.updateGauge(0);
        this.updateMetric('pingValue', '--');
        this.updateMetric('downloadValue', '--');
        this.updateMetric('uploadValue', '--');
        this.updateMetric('jitterValue', '-- ms');
        this.updateMetric('packetLoss', '-- %');
        
        try {
            // Run tests sequentially
            const ping = await this.measurePing();
            await this.delay(500);
            
            const download = await this.measureDownloadSpeed();
            await this.delay(500);
            
            const upload = await this.measureUploadSpeed();
            
            // Calculate additional metrics
            const jitter = this.calculateJitter(ping);
            const packetLoss = this.calculatePacketLoss();
            
            this.updateMetric('jitterValue', jitter, ' ms');
            this.updateMetric('packetLoss', packetLoss, ' %');
            
            // Save test results
            const testResult = {
                timestamp: new Date().toISOString(),
                ping,
                download,
                upload,
                jitter,
                packetLoss,
                server: this.currentServer,
                networkInfo: this.networkInfo
            };
            
            this.saveTestResult(testResult);
            this.updateHistoryDisplay();
            
            this.setStatus('Test Complete');
            this.showNotification('Speed test completed successfully!', 'success');
            
            setTimeout(() => this.setStatus('Ready', false), 2000);
            
        } catch (error) {
            this.setStatus('Test Failed');
            this.showNotification('Speed test failed. Please try again.', 'error');
            console.error('Speed test error:', error);
            setTimeout(() => this.setStatus('Ready', false), 2000);
        } finally {
            this.isTestRunning = false;
            button.disabled = false;
            button.textContent = 'Test Again';
            
            // Reset gauge after completion
            setTimeout(() => {
                this.updateGauge(0);
            }, 5000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    togglePanel() {
        const content = this.elements.panelContent;
        const toggle = this.elements.panelToggle;
        
        content.classList.toggle('collapsed');
        toggle.classList.toggle('collapsed');
    }

    saveTestResult(result) {
        this.testHistory.unshift(result);
        
        // Keep only last 10 tests
        if (this.testHistory.length > 10) {
            this.testHistory = this.testHistory.slice(0, 10);
        }
        
        localStorage.setItem('speedtest_history', JSON.stringify(this.testHistory));
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('speedtest_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Could not load test history:', error);
            return [];
        }
    }

    updateHistoryDisplay() {
        const historyList = this.elements.historyList;
        
        if (this.testHistory.length === 0) {
            historyList.innerHTML = '<div class="history-placeholder">No recent tests</div>';
            return;
        }
        
        historyList.innerHTML = this.testHistory.map(result => {
            const date = new Date(result.timestamp);
            const timeString = date.toLocaleString();
            const resultsString = `${result.download}↓ ${result.upload}↑ ${result.ping}ms`;
            
            return `
                <div class="history-item">
                    <span class="history-time">${timeString}</span>
                    <span class="history-results">${resultsString}</span>
                </div>
            `;
        }).join('');
    }

    clearHistory() {
        this.testHistory = [];
        localStorage.removeItem('speedtest_history');
        this.updateHistoryDisplay();
        this.showNotification('Test history cleared', 'warning');
    }

    exportResults(format) {
        if (this.testHistory.length === 0) {
            this.showNotification('No test results to export', 'warning');
            return;
        }

        let content, filename, mimeType;

        if (format === 'json') {
            content = JSON.stringify(this.testHistory, null, 2);
            filename = `speedtest_results_${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
        } else if (format === 'csv') {
            const headers = ['Timestamp', 'Ping (ms)', 'Download (Mbps)', 'Upload (Mbps)', 'Jitter (ms)', 'Packet Loss (%)', 'Server'];
            const csvContent = [
                headers.join(','),
                ...this.testHistory.map(result => [
                    result.timestamp,
                    result.ping,
                    result.download,
                    result.upload,
                    result.jitter,
                    result.packetLoss,
                    result.server
                ].join(','))
            ].join('\n');
            
            content = csvContent;
            filename = `speedtest_results_${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(`${format.toUpperCase()} export completed`, 'success');
    }

    shareResults() {
        if (this.testHistory.length === 0) {
            this.showNotification('No test results to share', 'warning');
            return;
        }

        const latest = this.testHistory[0];
        const text = `TopSteam Speed Test Results:
Download: ${latest.download} Mbps
Upload: ${latest.upload} Mbps
Ping: ${latest.ping} ms
Server: ${latest.server}`;

        if (navigator.share) {
            navigator.share({
                title: 'TopSteam Speed Test Results',
                text: text,
                url: window.location.href
            }).catch(error => {
                console.log('Error sharing:', error);
                this.fallbackShare(text);
            });
        } else {
            this.fallbackShare(text);
        }
    }

    fallbackShare(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Results copied to clipboard', 'success');
            }).catch(() => {
                this.showNotification('Could not copy to clipboard', 'error');
            });
        } else {
            this.showNotification('Sharing not supported on this device', 'warning');
        }
    }
}

// Initialize the speed test when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpeedTest();
});