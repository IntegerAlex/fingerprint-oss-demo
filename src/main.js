import './style.css'
import { userInfo } from 'fingerprint-oss';
// Importing function from local file 
// Note: This is just for testing purpose, in real world scenario you should import from 'fingerprint-oss'
//import { userInfo } from '../../dist/index.esm.js';

document.addEventListener('DOMContentLoaded', () => {
    const resultElement = document.getElementById('result');
    
    // Show loading indicator
    resultElement.textContent = 'Loading your digital fingerprint...';
    
    // Add animated loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    resultElement.appendChild(loadingIndicator);
    
    async function runTest() {
        try {
            // Get user information with a timeout to handle slow server responses
            const result = await Promise.race([
                userInfo(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request took too long. The server might be starting up.')), 15000)
                )
            ]);
            
            // Remove loading indicator
            if (document.querySelector('.loading-indicator')) {
                document.querySelector('.loading-indicator').remove();
            }
            
            // Format and enhance the display of the result
            formatAndDisplayResult(result);
            
        } catch (error) {
            // Remove loading indicator
            if (document.querySelector('.loading-indicator')) {
                document.querySelector('.loading-indicator').remove();
            }
            
            // Show user-friendly error message
            resultElement.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${error.message}</p>
                    <p class="error-help">The server might be starting up. Try refreshing in a moment.</p>
                </div>
            `;
            
            console.error('Fingerprinting error:', error);
        }
    }
    
    // Format the result in a more user-friendly way
    function formatAndDisplayResult(result) {
        // Create a container for the formatted result
        const container = document.createElement('div');
        container.className = 'fingerprint-result';
        
        // Add sections for different types of information
        const sections = {
            'Browser Information': {
                data: {
                    'Browser': result.browser?.name + ' ' + result.browser?.version,
                    'Operating System': result.os?.name + ' ' + result.os?.version,
                    'Device Type': result.device?.type || 'Unknown',
                    'Screen Resolution': `${window.screen.width}x${window.screen.height}`,
                    'Color Depth': window.screen.colorDepth + ' bits',
                    'Timezone': result.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                icon: 'fas fa-globe'
            },
            'Hardware Information': {
                data: {
                    'CPU Cores': navigator.hardwareConcurrency || 'Unknown',
                    'Memory': result.memory || 'Unknown',
                    'Device Model': result.device?.model || 'Unknown',
                    'Graphics Card': result.gpu || 'Unknown'
                },
                icon: 'fas fa-microchip'
            },
            'Network Information': {
                data: {
                    'IP Address': document.getElementById('client-ip')?.textContent || 'Loading...',
                    'Connection Type': result.connection?.type || 'Unknown',
                    'ISP': result.isp || 'Unknown',
                    'Proxy Detected': result.proxy ? 'Yes' : 'No'
                },
                icon: 'fas fa-network-wired'
            }
        };
        
        // Create UI for each section
        Object.entries(sections).forEach(([sectionName, sectionData]) => {
            const section = document.createElement('div');
            section.className = 'fingerprint-section';
            
            const header = document.createElement('div');
            header.className = 'section-header';
            header.innerHTML = `<i class="${sectionData.icon}"></i> ${sectionName}`;
            section.appendChild(header);
            
            const content = document.createElement('div');
            content.className = 'section-content';
            
            // Add each data point
            Object.entries(sectionData.data).forEach(([key, value]) => {
                if (value) {
                    const dataPoint = document.createElement('div');
                    dataPoint.className = 'data-point';
                    dataPoint.innerHTML = `
                        <span class="data-label">${key}:</span>
                        <span class="data-value">${value}</span>
                    `;
                    content.appendChild(dataPoint);
                }
            });
            
            section.appendChild(content);
            container.appendChild(section);
        });
        
        // Add technical details toggle
        const techDetailsToggle = document.createElement('div');
        techDetailsToggle.className = 'tech-details-toggle';
        techDetailsToggle.innerHTML = '<i class="fas fa-code"></i> View Technical Details';
        
        // Create raw JSON display (initially hidden)
        const rawJson = document.createElement('pre');
        rawJson.className = 'raw-json';
        rawJson.style.display = 'none';
        rawJson.textContent = JSON.stringify(result, null, 2);
        
        // Toggle raw JSON display when clicked
        techDetailsToggle.addEventListener('click', () => {
            if (rawJson.style.display === 'none') {
                rawJson.style.display = 'block';
                techDetailsToggle.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Technical Details';
            } else {
                rawJson.style.display = 'none';
                techDetailsToggle.innerHTML = '<i class="fas fa-code"></i> View Technical Details';
            }
        });
        
        container.appendChild(techDetailsToggle);
        container.appendChild(rawJson);
        
        // Set the formatted result
        resultElement.innerHTML = '';
        resultElement.appendChild(container);
        
        // Add styles for the formatted display
        addDisplayStyles();
    }
    
    // Add styles for better data display
    function addDisplayStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fingerprint-result {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .fingerprint-section {
                background-color: var(--bg-secondary);
                border-radius: var(--border-radius-md);
                overflow: hidden;
                box-shadow: var(--card-shadow);
            }
            
            .section-header {
                background-color: var(--bg-tertiary);
                padding: var(--spacing-sm) var(--spacing-md);
                font-weight: var(--font-weight-medium);
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                border-bottom: var(--border-width) solid var(--border-color);
            }
            
            .section-header i {
                color: var(--primary-color);
            }
            
            .section-content {
                padding: var(--spacing-sm) var(--spacing-md);
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: var(--spacing-sm);
            }
            
            .data-point {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--spacing-xs) 0;
                border-bottom: 1px dashed var(--border-color);
            }
            
            .data-label {
                color: var(--text-secondary);
                font-weight: var(--font-weight-medium);
            }
            
            .data-value {
                color: var(--text-primary);
            }
            
            .tech-details-toggle {
                align-self: center;
                margin-top: var(--spacing-sm);
                background-color: var(--bg-tertiary);
                padding: var(--spacing-xs) var(--spacing-md);
                border-radius: var(--border-radius-md);
                cursor: pointer;
                font-size: var(--font-size-sm);
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                transition: background-color var(--transition-fast);
            }
            
            .tech-details-toggle:hover {
                background-color: var(--border-color);
            }
            
            .raw-json {
                background-color: var(--bg-secondary);
                padding: var(--spacing-md);
                border-radius: var(--border-radius-md);
                border: var(--border-width) solid var(--border-color);
                font-family: 'Fira Code', 'Roboto Mono', monospace;
                font-size: var(--font-size-sm);
                white-space: pre-wrap;
                word-break: break-word;
                margin-top: var(--spacing-sm);
            }
            
            .error-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                text-align: center;
            }
            
            .error-message i {
                color: var(--error-color);
                font-size: 2rem;
            }
            
            .error-help {
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            }
            
            .loading-indicator {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-left: 10px;
                border: 3px solid rgba(0,0,0,0.1);
                border-radius: 50%;
                border-top-color: var(--primary-color);
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            @media (max-width: 768px) {
                .section-content {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Run the test
    runTest();
    
    // Add refresh button functionality
    if (document.getElementById('refresh-demo')) {
        document.getElementById('refresh-demo').addEventListener('click', function() {
            resultElement.textContent = 'Refreshing your digital fingerprint...';
            // Add animated loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            resultElement.appendChild(loadingIndicator);
            
            runTest();
        });
    }
}); 
