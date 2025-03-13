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
    
    /**
     * Retrieves the user's digital fingerprint and displays a formatted result.
     *
     * This asynchronous function attempts to fetch user information using a timeout of 15 seconds. Upon a successful response,
     * it removes the loading indicator and formats the result via a dedicated display function. In the event of a failure or timeout,
     * it removes the loading indicator, updates the UI with an error message, and logs the error to the console.
     *
     * @async
     */
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
    
    /**
     * Formats and displays the fingerprint result data on the web page.
     *
     * Constructs a user-friendly view by dynamically generating HTML sections for various data categories,
     * including Confidence Assessment, Geolocation Information, Browser & System, Hardware Information, Bot Detection,
     * and Uniqueness Score. The function updates UI components such as the client IP display and confidence bar, and
     * provides a toggleable section to view the raw JSON details of the fingerprint result.
     *
     * @param {Object} result - The fingerprint analysis data containing properties like geolocation, systemInfo, and
     *                          confidenceAssessment.
     */
    function formatAndDisplayResult(result) {
        // Create a container for the formatted result
        const container = document.createElement('div');
        container.className = 'fingerprint-result';
        
        // If we have an IP address from geolocation, update the display
        if (result.geolocation?.ip) {
            const ipElement = document.getElementById('client-ip');
            if (ipElement) {
                ipElement.textContent = result.geolocation.ip;
            }
        }
        
        // Update confidence bar if we have confidence assessment data
        if (result.confidenceAssessment?.system?.score) {
            updateConfidenceBar(result.confidenceAssessment.system);
        }
        
        // Add sections for different types of information based on actual data structure
        const sections = {
            'Confidence Assessment': {
                data: {
                    'System Score': formatConfidenceScore(result.confidenceAssessment?.system?.score),
                    'System Rating': result.confidenceAssessment?.system?.rating || 'Not Available',
                    'Combined Score': formatConfidenceScore(result.confidenceAssessment?.combined?.score),
                    'Combined Rating': result.confidenceAssessment?.combined?.rating || 'Not Available',
                    'Reliability': result.confidenceAssessment?.system?.reliability || 'Not Available'
                },
                icon: 'fas fa-chart-bar'
            },
            'Geolocation Information': {
                data: {
                    'IP Address': result.geolocation?.ip || document.getElementById('client-ip')?.textContent || 'Not Available',
                    'City': result.geolocation?.city || 'Not Available',
                    'Region': result.geolocation?.region?.name || 'Not Available',
                    'Country': result.geolocation?.country?.name || 'Not Available',
                    'Continent': result.geolocation?.continent?.name || 'Not Available',
                    'Timezone': result.geolocation?.location?.timeZone || 'Not Available',
                    'Coordinates': result.geolocation?.location ? 
                        `${result.geolocation.location.latitude}, ${result.geolocation.location.longitude}` : 
                        'Not Available'
                },
                icon: 'fas fa-map-marker-alt'
            },
            'Browser & System': {
                data: {
                    'Browser': formatBrowserInfo(result),
                    'User Agent': result.systemInfo?.userAgent || 'Not Available',
                    'Platform': result.systemInfo?.platform || 'Not Available',
                    'Operating System': formatOS(result.systemInfo?.os),
                    'Incognito Mode': result.systemInfo?.incognito?.isPrivate ? 'Yes' : 'No',
                    'Ad Blocker': result.systemInfo?.adBlocker?.adBlocker ? 'Yes' : 'No',
                    'Language': (result.systemInfo?.languages && result.systemInfo.languages.length > 0) ? 
                        result.systemInfo.languages.join(', ') : 'Not Available',
                    'Timezone': result.systemInfo?.timezone || 'Not Available',
                    'Cookies Enabled': result.systemInfo?.cookiesEnabled ? 'Yes' : 'No'
                },
                icon: 'fas fa-globe'
            },
            'Hardware Information': {
                data: {
                    'Screen Resolution': result.systemInfo?.screenResolution ? 
                        `${result.systemInfo.screenResolution[0]}x${result.systemInfo.screenResolution[1]}` : 
                        'Not Available',
                    'Color Depth': result.systemInfo?.colorDepth ? `${result.systemInfo.colorDepth} bits` : 'Not Available',
                    'CPU Cores': result.systemInfo?.hardwareConcurrency || 'Not Available',
                    'Device Memory': result.systemInfo?.deviceMemory ? `${result.systemInfo.deviceMemory} GB` : 'Not Available',
                    'Touch Support': result.systemInfo?.touchSupport?.maxTouchPoints > 0 ? 'Yes' : 'No',
                    'GPU Vendor': result.systemInfo?.webGL?.vendor || 'Not Available',
                    'GPU Renderer': result.systemInfo?.webGL?.renderer || 'Not Available'
                },
                icon: 'fas fa-microchip'
            },
            'Bot Detection': {
                data: {
                    'Bot Detection': result.systemInfo?.bot?.isBot ? 'Potential Bot Detected' : 'Human User Detected',
                    'Confidence': formatConfidenceScore(result.systemInfo?.bot?.confidence),
                    'Signals': formatBotSignals(result.systemInfo?.bot?.signals)
                },
                icon: 'fas fa-robot'
            },
            'Uniqueness Score': {
                data: {
                    // Remove the fingerprint hash from display
                    // 'Fingerprint Hash': generateFingerprintHash(result),
                    'System Confidence': formatConfidenceScore(result.systemInfo?.confidenceScore),
                    'Uniqueness Estimation': calculateUniquenessScore(result),
                    'Future Features': 'Fingerprint hash generation will be available in future releases.'
                },
                icon: 'fas fa-fingerprint'
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
                if (value && value !== 'Not Available') {
                    const dataPoint = document.createElement('div');
                    dataPoint.className = 'data-point';
                    
                    // Add tooltip for certain fields
                    if (['System Confidence', 'Uniqueness Estimation', 'Bot Detection', 'Future Features'].includes(key)) {
                        dataPoint.classList.add('tooltip');
                        
                        // Style the Future Features differently to indicate it's a future scope
                        if (key === 'Future Features') {
                            dataPoint.classList.add('future-feature');
                            dataPoint.innerHTML = `
                                <span class="data-label"><i class="fas fa-hourglass-half"></i> ${key}:</span>
                                <span class="data-value future-value">${value}</span>
                                <span class="tooltip-text">${getTooltipForField(key)}</span>
                            `;
                        } else {
                            dataPoint.innerHTML = `
                                <span class="data-label">${key}:</span>
                                <span class="data-value">${value}</span>
                                <span class="tooltip-text">${getTooltipForField(key)}</span>
                            `;
                        }
                    } else {
                        dataPoint.innerHTML = `
                            <span class="data-label">${key}:</span>
                            <span class="data-value">${value}</span>
                        `;
                    }
                    
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
    
    /**
     * Formats a confidence score as a percentage string with a rating indicator.
     *
     * If the input score is null or undefined, the function returns "Not Available". For a valid score
     * (typically a decimal between 0 and 1), the value is converted to a rounded percentage and paired with:
     * - "🟢 High" for 80% or above,
     * - "🟡 Medium" for 60% to 79%,
     * - "🔴 Low" for below 60%.
     *
     * @param {number} score - A confidence score, usually a decimal value between 0 and 1.
     * @returns {string} The formatted confidence score as a percentage and rating indicator.
     */
    function formatConfidenceScore(score) {
        if (score === undefined || score === null) return 'Not Available';
        
        const percentage = Math.round(score * 100);
        let indicator = '';
        
        if (percentage >= 80) {
            indicator = '🟢 High';
        } else if (percentage >= 60) {
            indicator = '🟡 Medium';
        } else {
            indicator = '🔴 Low';
        }
        
        return `${percentage}% (${indicator})`;
    }
    
    /**
     * Formats OS information into a user-friendly string.
     *
     * Returns a string combining the operating system's name and its version if available.
     * If no OS information is provided, it returns "Not Available".
     *
     * @param {{ os: string, version?: string } | null} osInfo - The operating system details.
     * @returns {string} A formatted string with the OS name and optional version, or "Not Available" if osInfo is falsy.
     */
    function formatOS(osInfo) {
        if (!osInfo) return 'Not Available';
        return `${osInfo.os} ${osInfo.version || ''}`.trim();
    }
    
    /**
     * Extracts the browser name from the provided system information.
     *
     * The function first checks for an incognito browser name. If absent, it verifies whether
     * the ad blocker's data indicates a Brave browser. If still not determined, it inspects the
     * vendor flavors for a reference to a Chrome-based browser. If none of these sources yield a result,
     * it returns 'Not Available'.
     *
     * @param {object} result - An object containing system information with properties such as incognito,
     *                          adBlocker, and vendorFlavors.
     * @returns {string} The formatted browser name or 'Not Available' if no valid browser information is found.
     */
    function formatBrowserInfo(result) {
        // First try to get the browser name from incognito info
        let browserName = result.systemInfo?.incognito?.browserName;
        
        // If not available, check if it's a Brave browser
        if (!browserName && result.systemInfo?.adBlocker?.isBrave) {
            browserName = 'Brave';
        }
        
        // If still not available, check vendor flavors
        if (!browserName && result.systemInfo?.vendorFlavors?.includes('chrome')) {
            browserName = 'Chrome-based';
        }
        
        return browserName || 'Not Available';
    }
    
    /**
     * Formats an array of bot detection signals into a human-readable string.
     *
     * Each signal should be a string in the "level:description" format. The function extracts the
     * level and description, then returns them as "description (level)". If the signals array is null,
     * undefined, or empty, it returns "None detected".
     *
     * @param {string[]} signals - An array of bot signal strings in the "level:description" format.
     * @returns {string} A formatted string listing bot signals, or "None detected" if no signals are provided.
     */
    function formatBotSignals(signals) {
        if (!signals || signals.length === 0) return 'None detected';
        
        return signals.map(signal => {
            // Extract level and description from "level:description" format
            const [level, description] = signal.split(':');
            return `${description} (${level})`;
        }).join(', ');
    }
    
    /**
     * Returns a placeholder fingerprint hash.
     *
     * This function currently acts as a stub by always returning a placeholder string ("Feature coming soon").
     * In a future release, it will generate a 12-character hexadecimal fingerprint hash based on various system
     * properties (such as user agent, screen resolution, color depth, platform, plugins, font preferences,
     * timezone, and languages). The actual hash computation logic has been retained in comments for development reference.
     *
     * @param {Object} data - System information that would be used to generate the fingerprint hash.
     * @returns {string} A placeholder string indicating that the fingerprint hash feature is forthcoming.
     */
    function generateFingerprintHash(data) {
        // This functionality has been removed from the current UI
        // It will be implemented in a future release with improved algorithms
        
        // Code retained for development reference:
        /*
        // Use the fingerprint hash if already available in the data
        if (data.systemInfo?.fingerprint) return data.systemInfo.fingerprint;
        
        // Otherwise create a simple hash
        const str = JSON.stringify({
            userAgent: data.systemInfo?.userAgent,
            screenResolution: data.systemInfo?.screenResolution,
            colorDepth: data.systemInfo?.colorDepth,
            platform: data.systemInfo?.platform,
            plugins: data.systemInfo?.plugins,
            fonts: data.systemInfo?.fontPreferences,
            timezone: data.systemInfo?.timezone,
            language: data.systemInfo?.languages
        });
        
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Convert to hex format with a length of 12 characters
        return (Math.abs(hash).toString(16) + '000000000000').slice(0, 12);
        */
        
        return "Feature coming soon";
    }
    
    /**
     * Calculates and returns a formatted uniqueness score based on available confidence scores.
     *
     * The function checks for a confidence score from:
     * - systemInfo.confidenceScore,
     * - confidenceAssessment.system.score, or
     * - confidenceAssessment.combined.score.
     *
     * If none are provided, it defaults to a score of 0.5 (50%). The score is converted to a percentage and a string
     * is returned indicating the uniqueness level ("High" with a lock emoji for scores of 80% or higher, "Medium"
     * with a bell emoji for scores between 60% and 79%, or "Low" with a warning emoji for scores below 60%).
     *
     * @param {Object} data - An object containing confidence score information.
     * @returns {string} The formatted uniqueness score.
     */
    function calculateUniquenessScore(data) {
        // Use system confidence score if available
        const confidenceScore = data.systemInfo?.confidenceScore || 
                              data.confidenceAssessment?.system?.score || 
                              data.confidenceAssessment?.combined?.score || 
                              0.5; // Default to medium if no scores available
        
        const percentage = Math.round(confidenceScore * 100);
        
        // Return in a readable format with emoji indicator
        if (percentage >= 80) {
            return `High (${percentage}%) 🔒`;
        } else if (percentage >= 60) {
            return `Medium (${percentage}%) 🔔`;
        } else {
            return `Low (${percentage}%) ⚠️`;
        }
    }
    
    /**
     * Retrieves the tooltip text for a given fingerprint field.
     *
     * Looks up a predefined set of tooltips corresponding to common field names and returns the descriptive message.
     * If the field is not recognized, an empty string is returned.
     *
     * @param {string} field - The name of the field for which to obtain the tooltip.
     * @returns {string} The tooltip text associated with the field, or an empty string if none exists.
     */
    function getTooltipForField(field) {
        const tooltips = {
            // Keep the tooltip but comment out since we're not displaying it
            // 'Fingerprint Hash': 'A unique identifier generated from your device characteristics. This is not personally identifiable.',
            'System Confidence': 'How confident the system is about the accuracy of the collected data.',
            'Uniqueness Estimation': 'How distinguishable your browser fingerprint is compared to others. Higher uniqueness means better identification accuracy.',
            'Bot Detection': 'Analysis of whether this session appears to be from an automated system or a human user.',
            'Future Features': 'Features that are planned for upcoming releases of the fingerprint library.'
        };
        
        return tooltips[field] || '';
    }
    
    /**
     * Injects CSS styles for digital fingerprint data display into the document head.
     *
     * This function dynamically creates a <style> element containing style rules for layout,
     * section formatting, tooltips, error messages, loading animations, and responsive behavior.
     * The injected styles enhance the visual presentation and user interaction of fingerprint-related UI components.
     */
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
                transition: transform var(--transition-normal), box-shadow var(--transition-normal);
            }
            
            .fingerprint-section:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 15px var(--shadow-color);
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
                position: relative;
            }
            
            .data-label {
                color: var(--text-secondary);
                font-weight: var(--font-weight-medium);
            }
            
            .data-value {
                color: var(--text-primary);
                max-width: 60%;
                text-align: right;
                word-break: break-word;
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
                transition: background-color var(--transition-fast), transform var(--transition-fast);
            }
            
            .tech-details-toggle:hover {
                background-color: var(--border-color);
                transform: translateY(-2px);
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
                
                .data-value {
                    max-width: 50%;
                }
            }

            /* Future feature styling */
            .future-feature {
                background-color: var(--bg-tertiary);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-xs) var(--spacing-sm);
                margin-top: var(--spacing-sm);
                border-left: 3px dashed var(--primary-color);
            }
            
            .future-feature .data-label {
                color: var(--primary-color);
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
            }
            
            .future-value {
                font-style: italic;
                color: var(--text-secondary);
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

    /**
     * Updates the confidence bar UI elements based on provided confidence data.
     *
     * If valid confidence data and required DOM elements are present, this function calculates a percentage
     * value from the confidence score and updates the text, fill width, and color of the confidence bar accordingly.
     * The fill color is set to success, warning, or error based on predefined percentage thresholds.
     *
     * @param {{score: number, rating: string}} confidenceData - An object containing the confidence score (a value between 0 and 1) and its descriptive rating.
     */
    function updateConfidenceBar(confidenceData) {
        if (!confidenceData) return;
        
        const confidenceBar = document.getElementById('confidence-bar');
        const confidenceText = document.getElementById('confidence-text');
        const confidenceFill = document.getElementById('confidence-bar-fill');
        
        if (confidenceBar && confidenceText && confidenceFill) {
            // Show the confidence bar
            confidenceBar.style.display = 'block';
            
            // Calculate the percentage
            const percentage = Math.round(confidenceData.score * 100);
            
            // Update the text
            confidenceText.textContent = `${confidenceData.rating} (${percentage}%)`;
            
            // Update the fill
            confidenceFill.style.width = `${percentage}%`;
            
            // Set color based on confidence level
            if (percentage >= 80) {
                confidenceFill.style.backgroundColor = 'var(--success-color)';
            } else if (percentage >= 60) {
                confidenceFill.style.backgroundColor = 'var(--warning-color)';
            } else {
                confidenceFill.style.backgroundColor = 'var(--error-color)';
            }
        }
    }
}); 
