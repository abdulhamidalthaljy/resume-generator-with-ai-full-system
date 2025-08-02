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
        // Base HTML structure
        const baseHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume</title>
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
        const baseCSS = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        background: white;
        font-size: 14px;
      }
      
      .resume-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      h1, h2, h3 {
        margin-bottom: 10px;
      }
      
      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      
      .section h2 {
        border-bottom: 2px solid #3B82F6;
        padding-bottom: 5px;
        margin-bottom: 15px;
        color: #1F2937;
        font-size: 18px;
        font-weight: bold;
      }
      
      .personal-info {
        text-align: center;
        margin-bottom: 30px;
        page-break-inside: avoid;
      }
      
      .personal-info h1 {
        font-size: 28px;
        color: #1F2937;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
        margin: 15px 0;
      }
      
      .contact-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        color: #4B5563;
      }
      
      .skills-section, .strengths-section {
        margin-top: 10px;
        text-align: left;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        font-size: 13px;
        color: #4B5563;
      }
      
      .skills-section strong, .strengths-section strong {
        color: #1F2937;
      }
      
      .work-item, .education-item, .workshop-item {
        margin-bottom: 18px;
        padding-left: 10px;
        page-break-inside: avoid;
      }
      
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }
      
      .item-title {
        font-weight: bold;
        color: #1F2937;
        font-size: 15px;
      }
      
      .item-company {
        color: #3B82F6;
        font-weight: 500;
        font-size: 14px;
        margin-top: 2px;
      }
      
      .item-location {
        color: #6B7280;
        font-size: 12px;
        font-style: italic;
        margin-top: 1px;
      }
      
      .item-date {
        color: #6B7280;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
      }
      
      .item-description {
        margin-top: 8px;
        color: #4B5563;
        font-size: 13px;
        line-height: 1.5;
      }
      
      .languages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      }
      
      .language-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        background: #F3F4F6;
        border-radius: 5px;
        font-size: 13px;
      }
      
      .language-item span:first-child {
        font-weight: 500;
        color: #1F2937;
      }
      
      .language-item span:last-child {
        color: #6B7280;
      }
      
      .profile-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 auto 15px;
        display: block;
        border: 3px solid #E5E7EB;
      }
      
      @media print {
        body { 
          margin: 0; 
          padding: 0; 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
        }
        .resume-container {
          padding: 15px;
        }
        .section {
          page-break-inside: avoid;
        }
        .work-item, .education-item, .workshop-item {
          page-break-inside: avoid;
        }
      }
      
      @page { 
        size: A4; 
        margin: 0.5in; 
      }
    `;

        // Template-specific CSS
        const templateStyles = {
            classic: `
        .resume-container { 
          font-family: 'Times New Roman', serif; 
        }
        .section h2 { 
          border-bottom-color: #1F2937;
          font-family: 'Times New Roman', serif;
        }
        .personal-info h1 {
          font-family: 'Times New Roman', serif;
        }
      `,
            modern: `
        .resume-container { 
          font-family: 'Arial', sans-serif; 
        }
        .section h2 { 
          background: linear-gradient(90deg, #3B82F6, #1D4ED8);
          color: white;
          padding: 10px 15px;
          border-radius: 6px;
          border: none;
          margin-bottom: 20px;
        }
        .personal-info h1 { 
          color: #3B82F6; 
          font-weight: 600;
        }
        .item-title {
          color: #1D4ED8;
        }
        .profile-image {
          border-color: #3B82F6;
        }
      `,
            minimal: `
        .resume-container { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
        }
        .section h2 { 
          border-bottom: 1px solid #E5E7EB;
          color: #374151;
          font-weight: 400;
          font-size: 16px;
        }
        .personal-info h1 { 
          font-weight: 300; 
          font-size: 26px;
        }
        .item-title {
          font-weight: 500;
        }
        .profile-image {
          border: 2px solid #E5E7EB;
        }
      `,
            executive: `
        .resume-container { 
          font-family: 'Georgia', serif;
        }
        .section h2 { 
          background: #1F2937;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .personal-info { 
          background: #F8FAFC;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
        }
        .personal-info h1 {
          color: #1F2937;
          font-weight: bold;
        }
        .item-title {
          color: #1F2937;
          font-weight: bold;
        }
        .profile-image {
          border: 4px solid #1F2937;
        }
      `
        };

        return baseCSS + (templateStyles[templateId] || templateStyles.classic);
    }

    generateTemplateHTML(resumeData, templateId) {
        const { personalDetails, informationSummary, workExperience, education, workshops, languages } = resumeData;

        return `
      <div class="resume-container">
        <!-- Personal Information -->
        <div class="personal-info">
          ${personalDetails.imageUrl ? `<img src="${personalDetails.imageUrl}" alt="Profile" class="profile-image">` : ''}
          <h1>${personalDetails.name || 'Your Name'}</h1>
          <div class="contact-info">
            ${personalDetails.email ? `<div class="contact-item">📧 ${personalDetails.email}</div>` : ''}
            ${personalDetails.phone ? `<div class="contact-item">📱 ${personalDetails.phone}</div>` : ''}
            ${personalDetails.address ? `<div class="contact-item">📍 ${personalDetails.address}</div>` : ''}
            ${personalDetails.birthDate ? `<div class="contact-item">🎂 ${personalDetails.birthDate}</div>` : ''}
            ${personalDetails.nationality ? `<div class="contact-item">🌍 ${personalDetails.nationality}</div>` : ''}
            ${personalDetails.familyStatus ? `<div class="contact-item">👨‍👩‍👧‍👦 ${personalDetails.familyStatus}</div>` : ''}
          </div>
          ${personalDetails.itSkills ? `<div class="skills-section"><strong>IT Skills:</strong> ${personalDetails.itSkills}</div>` : ''}
          ${personalDetails.strengths ? `<div class="strengths-section"><strong>Strengths:</strong> ${personalDetails.strengths}</div>` : ''}
        </div>

        <!-- Professional Summary -->
        ${informationSummary ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${informationSummary}</p>
          </div>
        ` : ''}

        <!-- Work Experience -->
        ${workExperience && workExperience.length > 0 && workExperience.some(work => work.position || work.company) ? `
          <div class="section">
            <h2>Work Experience</h2>
            ${workExperience.filter(work => work.position || work.company).map(work => `
              <div class="work-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${work.position || 'Job Title'}</div>
                    <div class="item-company">${work.company || 'Tech Company Inc.'}</div>
                  </div>
                  <div class="item-date">${work.date || '- Present'}</div>
                </div>
                ${work.description ? `<div class="item-description">${work.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education && education.length > 0 && education.some(edu => edu.degree || edu.school) ? `
          <div class="section">
            <h2>Education</h2>
            ${education.filter(edu => edu.degree || edu.school).map(edu => `
              <div class="education-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${edu.degree || 'Bachelor of Computer Science'}</div>
                    <div class="item-company">${edu.school || 'Institution'}</div>
                    ${edu.place ? `<div class="item-location">${edu.place}</div>` : ''}
                  </div>
                  <div class="item-date">${edu.date || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Workshops/Certifications -->
        ${workshops && workshops.length > 0 && workshops.some(workshop => workshop.title) ? `
          <div class="section">
            <h2>Workshops & Certifications</h2>
            ${workshops.filter(workshop => workshop.title).map(workshop => `
              <div class="workshop-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${workshop.title || 'Workshop Title'}</div>
                    <div class="item-company">${workshop.organizer || 'Organizer'}</div>
                  </div>
                  <div class="item-date">${workshop.date || ''}</div>
                </div>
                ${workshop.description ? `<div class="item-description">${workshop.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Languages -->
        ${languages && languages.length > 0 && languages.some(lang => lang.name) ? `
          <div class="section">
            <h2>Languages</h2>
            <div class="languages-grid">
              ${languages.filter(lang => lang.name).map(lang => `
                <div class="language-item">
                  <span>${lang.name || 'Language'}</span>
                  <span>${lang.level || 'Proficiency'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
    }
}

module.exports = PDFGeneratorService;
