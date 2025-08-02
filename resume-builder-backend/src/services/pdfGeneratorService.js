const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFGeneratorService {
    constructor() {
        this.browser = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (!this.isInitialized) {
            try {
                console.log('Initializing Puppeteer browser...');
                this.browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu'
                    ]
                });
                this.isInitialized = true;
                console.log('Puppeteer browser initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Puppeteer browser:', error);
                throw error;
            }
        }
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.isInitialized = false;
        }
    }

    async generateResumePDF(resumeData, templateId = 'classic') {
        const start = performance.now();

        try {
            await this.initialize();

            const page = await this.browser.newPage();

            // Set viewport to A4 size (8.27 × 11.69 inches at 96 DPI)
            await page.setViewport({
                width: 794,  // A4 width at 96 DPI
                height: 1123, // A4 height at 96 DPI
                deviceScaleFactor: 1
            });

            // Create HTML content for the resume
            const htmlContent = this.generateResumeHTML(resumeData, templateId);

            // Set the HTML content
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Add print styles
            await page.addStyleTag({
                content: `
          @media print {
            body { margin: 0; padding: 20px; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
          @page { 
            size: A4; 
            margin: 0.5in; 
          }
        `
            });

            // Generate PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0.5in',
                    right: '0.5in',
                    bottom: '0.5in',
                    left: '0.5in'
                },
                preferCSSPageSize: true
            });

            await page.close();

            const duration = Number(performance.now() - start).toFixed(0);
            console.log(`PDF generation took ${duration}ms`);

            return pdfBuffer;

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate PDF: ' + error.message);
        }
    }

    async generateResumePreview(resumeData, templateId = 'classic') {
        const start = performance.now();

        try {
            await this.initialize();

            const page = await this.browser.newPage();

            // Set viewport for preview (smaller than PDF)
            await page.setViewport({
                width: 400,
                height: 566, // A4 aspect ratio
                deviceScaleFactor: 2 // Higher DPI for better quality
            });

            // Create HTML content for the resume
            const htmlContent = this.generateResumeHTML(resumeData, templateId);

            // Set the HTML content
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Generate screenshot
            const imageBuffer = await page.screenshot({
                type: 'jpeg',
                quality: 85,
                fullPage: true
            });

            await page.close();

            const duration = Number(performance.now() - start).toFixed(0);
            console.log(`Preview generation took ${duration}ms`);

            return imageBuffer;

        } catch (error) {
            console.error('Error generating preview:', error);
            throw new Error('Failed to generate preview: ' + error.message);
        }
    }

    generateResumeHTML(resumeData, templateId) {
        // Base HTML structure with proper Tailwind CSS
        const baseHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${this.getTemplateCSS(templateId)}
        </style>
      </head>
      <body>
        ${this.generateTemplateHTML(resumeData, templateId)}
      </body>
      </html>
    `;

        return baseHTML;
    }

    getTemplateCSS(templateId) {
        // Import Inter font and custom styles
        const baseCSS = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #374151;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .classic-template {
                font-family: 'Inter', sans-serif;
                background: white;
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .section-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: #2563eb;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding-bottom: 0.25rem;
                margin-bottom: 0.75rem;
                border-bottom: 2px solid #dbeafe;
            }
            
            .profile-image {
                width: 7rem;
                height: 7rem;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid #dbeafe;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                margin-bottom: 2rem;
                text-align: left;
            }
            
            .header-flex {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }
            
            .name {
                font-size: 2.25rem;
                font-weight: 700;
                color: #1d4ed8;
                letter-spacing: -0.025em;
                margin-bottom: 0.5rem;
            }
            
            .contact-info {
                margin-top: 0.5rem;
                font-size: 0.875rem;
                color: #6b7280;
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.375rem;
            }
            
            .section {
                margin-bottom: 1.5rem;
            }
            
            .work-item, .education-item, .workshop-item {
                margin-bottom: 1rem;
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.25rem;
            }
            
            .item-title {
                font-size: 1rem;
                font-weight: 600;
                color: #374151;
            }
            
            .item-company {
                font-size: 0.875rem;
                font-weight: 500;
                color: #2563eb;
                margin-bottom: 0.25rem;
            }
            
            .item-date {
                font-size: 0.75rem;
                color: #6b7280;
            }
            
            .item-description {
                font-size: 0.75rem;
                color: #4b5563;
                line-height: 1.5;
                white-space: pre-line;
            }
            
            .skills-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            
            .languages-list {
                list-style: none;
                padding: 0;
            }
            
            .language-item {
                font-size: 0.875rem;
                color: #374151;
                margin-bottom: 0.25rem;
            }
            
            .language-name {
                font-weight: 500;
            }
            
            .skill-category {
                margin-bottom: 0.5rem;
            }
            
            .skill-category-title {
                font-size: 0.75rem;
                font-weight: 600;
                color: #4b5563;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.25rem;
            }
            
            .skill-content {
                font-size: 0.875rem;
                color: #374151;
                white-space: pre-line;
            }
            
            .additional-info {
                font-size: 0.875rem;
                color: #374151;
            }
            
            .additional-info li {
                margin-bottom: 0.25rem;
                list-style: none;
            }
            
            .additional-info strong {
                font-weight: 600;
            }
            
            /* Print optimizations */
            @media print {
                body {
                    font-size: 12px;
                }
                
                .classic-template {
                    padding: 1rem;
                }
                
                .section-title {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                    color: #000;
                    border-bottom: 1px solid #6b7280;
                }
                
                .name {
                    font-size: 1.5rem;
                }
                
                .profile-image {
                    width: 6rem;
                    height: 6rem;
                    border: 2px solid #dbeafe;
                }
                
                .contact-info {
                    font-size: 0.75rem;
                }
                
                .item-title {
                    font-size: 0.875rem;
                }
                
                .item-company {
                    font-size: 0.75rem;
                }
                
                .item-date {
                    font-size: 0.625rem;
                }
                
                .item-description {
                    font-size: 0.625rem;
                }
            }
        `;

        return baseCSS;
    }

    generateTemplateHTML(resumeData, templateId) {
        const { personalDetails, informationSummary, workExperience, education, workshops, languages } = resumeData;

        // Generate classic template (similar to frontend)
        return `
      <div class="classic-template">
        <!-- Header: Name, Contact, Image -->
        <header class="header">
          <div class="header-flex">
            ${personalDetails?.imageUrl ? `
              <div>
                <img src="${personalDetails.imageUrl}" alt="Profile Photo" class="profile-image">
              </div>
            ` : ''}
            <div style="flex: 1;">
              <h1 class="name">${personalDetails?.name || 'Your Name'}</h1>
              <div class="contact-info">
                ${personalDetails?.phone ? `
                  <span class="contact-item">
                    <span>�</span>
                    <span>${personalDetails.phone}</span>
                  </span>
                ` : ''}
                ${personalDetails?.email ? `
                  <span class="contact-item">
                    <span>✉️</span>
                    <span>${personalDetails.email}</span>
                  </span>
                ` : ''}
                ${personalDetails?.address ? `
                  <span class="contact-item">
                    <span>📍</span>
                    <span>${personalDetails.address}</span>
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
        </header>

        <!-- Professional Summary -->
        ${informationSummary ? `
          <section class="section">
            <h2 class="section-title">Profile Summary</h2>
            <p class="item-description">${informationSummary}</p>
          </section>
        ` : ''}

        <!-- Work Experience -->
        ${workExperience && workExperience.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Work Experience</h2>
            ${workExperience.map(work => `
              <div class="work-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${work.position || 'Job Title'}</div>
                    <div class="item-company">${work.company || 'Company Name'}</div>
                  </div>
                  <div class="item-date">${work.date || 'Date Range'}</div>
                </div>
                ${work.description ? `<div class="item-description">${work.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Education -->
        ${education && education.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Education</h2>
            ${education.map(edu => `
              <div class="education-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${edu.degree || 'Degree / Field of Study'}</div>
                    <div class="item-company">${edu.school || 'Institution Name'}</div>
                  </div>
                  <div class="item-date">${edu.date || 'Date Range'}</div>
                </div>
                ${edu.place ? `<div class="item-description">${edu.place}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Skills & Languages Grid -->
        <div class="skills-grid">
          <!-- Skills Section -->
          ${personalDetails && (personalDetails.itSkills || personalDetails.strengths) ? `
            <section class="section">
              <h2 class="section-title">Skills</h2>
              ${personalDetails.itSkills ? `
                <div class="skill-category">
                  <h4 class="skill-category-title">Technical Skills</h4>
                  <p class="skill-content">${personalDetails.itSkills}</p>
                </div>
              ` : ''}
              ${personalDetails.strengths ? `
                <div class="skill-category">
                  <h4 class="skill-category-title">Strengths</h4>
                  <p class="skill-content">${personalDetails.strengths}</p>
                </div>
              ` : ''}
            </section>
          ` : ''}

          <!-- Languages Section -->
          ${languages && languages.length > 0 ? `
            <section class="section">
              <h2 class="section-title">Languages</h2>
              <ul class="languages-list">
                ${languages.map(lang => `
                  <li class="language-item">
                    <span class="language-name">${lang.name || 'Language'}:</span>
                    ${lang.level || 'Level'}
                  </li>
                `).join('')}
              </ul>
            </section>
          ` : ''}
        </div>

        <!-- Workshops & Certifications -->
        ${workshops && workshops.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Workshops & Certifications</h2>
            ${workshops.map(workshop => `
              <div class="workshop-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${workshop.title || 'Workshop/Certification Title'}</div>
                    <div class="item-company">${workshop.place || 'Issuing Organization / Place'}</div>
                  </div>
                  <div class="item-date">${workshop.date || 'Date'}</div>
                </div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Additional Information -->
        ${personalDetails && (personalDetails.birthDate || personalDetails.nationality || personalDetails.familyStatus) ? `
          <section class="section">
            <h2 class="section-title">Additional Information</h2>
            <ul class="additional-info">
              ${personalDetails.birthDate ? `<li><strong>Birth Date:</strong> ${personalDetails.birthDate}</li>` : ''}
              ${personalDetails.nationality ? `<li><strong>Nationality:</strong> ${personalDetails.nationality}</li>` : ''}
              ${personalDetails.familyStatus ? `<li><strong>Family Status:</strong> ${personalDetails.familyStatus}</li>` : ''}
            </ul>
          </section>
        ` : ''}
      </div>
    `;
    }
}

module.exports = PDFGeneratorService;
