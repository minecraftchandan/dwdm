    document.addEventListener('DOMContentLoaded', () => {
        const datasetPreviewDiv = document.getElementById('dataset-preview');
        const themeToggle = document.getElementById('checkbox');
        const body = document.body;
        let isDatasetPreviewVisible = false;

        // --- Theme Switching Logic ---
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            body.classList.add(currentTheme);
            if (currentTheme === 'dark-mode') {
                themeToggle.checked = true;
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            themeToggle.checked = true;
            localStorage.setItem('theme', 'dark-mode');
        } else {
            localStorage.setItem('theme', 'light-mode');
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });

        // --- Copy to Clipboard Function ---
        const copyToClipboard = (elementId) => {
            const codeElement = document.getElementById(elementId);
            if (codeElement) {
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = codeElement.value;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);

                const button = document.querySelector(`[data-target-code-id="${elementId}"]`);
                if (button) {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                }
            }
        };

        // --- Render CSV string into an HTML table ---
        const renderTableFromCsv = (csvString) => {
            const lines = csvString.trim().split('\n');
            if (lines.length === 0) {
                return '<p>No data found in the file.</p>';
            }

            let html = '<table>';
            html += '<thead><tr>';
            const headers = lines[0].split(',');
            headers.forEach(headerText => {
                html += `<th>${headerText.trim()}</th>`;
            });
            html += '</tr></thead>';

            html += '<tbody>';
            for (let i = 1; i < lines.length; i++) {
                html += '<tr>';
                const cells = lines[i].split(',');
                cells.forEach(cellText => {
                    html += `<td>${cellText.trim()}</td>`;
                });
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        };

        // --- Fetch and process XLSX for preview ---
        // --- Sticky navbar spacing ---
        document.body.style.paddingTop = '70px';

        // --- Set up copy buttons ---
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', () => copyToClipboard(button.dataset.targetCodeId));
        });
    });
