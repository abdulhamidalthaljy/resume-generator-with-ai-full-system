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
        // Import fonts for different templates
        const fonts = {
            classic: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");',
            modern: '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");',
            minimal: '@import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap");',
            executive: '@import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap");'
        };

        const baseCSS = `
            ${fonts[templateId] || fonts.classic}
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                line-height: 1.6;
                color: #374151;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        `;

        // Template-specific CSS
        switch (templateId) {
            case 'modern':
                return baseCSS + this.getModernTemplateCSS();
            case 'minimal':
                return baseCSS + this.getMinimalTemplateCSS();
            case 'executive':
                return baseCSS + this.getExecutiveTemplateCSS();
            case 'classic':
            default:
                return baseCSS + this.getClassicTemplateCSS();
        }
    }

    getClassicTemplateCSS() {
        return `
            body {
                font-family: 'Inter', sans-serif;
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
    }

    getModernTemplateCSS() {
        return `
            body {
                font-family: 'Poppins', sans-serif;
            }
            
            .modern-template {
                font-family: 'Poppins', sans-serif;
                background: white;
            }
            
            .modern-header {
                background: linear-gradient(to right, #7c3aed, #8b5cf6);
                color: white;
                padding: 2rem;
                text-align: center;
            }
            
            .profile-image {
                width: 6rem;
                height: 6rem;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid white;
                box-shadow: 0 4px 15px -1px rgba(0, 0, 0, 0.2);
                margin-bottom: 1rem;
            }
            
            .name {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: white;
            }
            
            .contact-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 1.5rem;
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.9);
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .modern-content {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            
            .main-content {
                space-y: 1.5rem;
            }
            
            .sidebar {
                space-y: 1.5rem;
            }
            
            .section-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #7c3aed;
                margin-bottom: 1rem;
                position: relative;
                padding-bottom: 0.5rem;
            }
            
            .section-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 40px;
                height: 3px;
                background: linear-gradient(to right, #7c3aed, #c084fc);
                border-radius: 2px;
            }
            
            .sidebar-title {
                font-size: 1.125rem;
                font-weight: 700;
                color: #7c3aed;
                margin-bottom: 0.75rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .work-item {
                position: relative;
                padding-left: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .work-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0.25rem;
                width: 0.75rem;
                height: 0.75rem;
                background: #7c3aed;
                border-radius: 50%;
            }
            
            .work-item::after {
                content: '';
                position: absolute;
                left: 0.375rem;
                top: 1rem;
                width: 0.125rem;
                height: calc(100% - 1rem);
                background: #e5e7eb;
            }
            
            .work-content {
                background: #f9fafb;
                padding: 1rem;
                border-radius: 0.5rem;
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;
            }
            
            .item-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: #374151;
            }
            
            .item-company {
                font-size: 0.875rem;
                font-weight: 500;
                color: #7c3aed;
                margin-bottom: 0.5rem;
            }
            
            .item-date {
                font-size: 0.875rem;
                color: #7c3aed;
                font-weight: 500;
            }
            
            .item-description {
                font-size: 0.875rem;
                color: #4b5563;
                line-height: 1.6;
                white-space: pre-line;
            }
            
            .skill-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .skill-tag {
                background: #f3e8ff;
                color: #7c3aed;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .languages-list {
                list-style: none;
                padding: 0;
            }
            
            .language-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.875rem;
                color: #374151;
                margin-bottom: 0.5rem;
                padding: 0.5rem;
                background: #f9fafb;
                border-radius: 0.25rem;
            }
            
            .language-name {
                font-weight: 500;
            }
            
            .language-level {
                color: #7c3aed;
                font-size: 0.75rem;
            }
            
            @media print {
                .modern-template {
                    font-size: 12px;
                }
                
                .modern-header {
                    background: #7c3aed !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                .name {
                    font-size: 1.75rem;
                }
                
                .profile-image {
                    width: 5rem;
                    height: 5rem;
                }
                
                .modern-content {
                    padding: 1rem;
                    gap: 1rem;
                }
            }
        `;
    }

    getMinimalTemplateCSS() {
        return `
            body {
                font-family: 'Source Sans Pro', sans-serif;
            }
            
            .minimal-template {
                font-family: 'Source Sans Pro', sans-serif;
                background: white;
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
            }
            
            .minimal-header {
                text-align: center;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .profile-image {
                width: 5rem;
                height: 5rem;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #d1d5db;
                margin: 0 auto 1rem;
            }
            
            .name {
                font-size: 2.5rem;
                font-weight: 300;
                color: #374151;
                letter-spacing: 0.05em;
                margin-bottom: 1rem;
            }
            
            .contact-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 1rem;
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.375rem;
            }
            
            .section {
                margin-bottom: 2rem;
                text-align: center;
            }
            
            .section-title {
                font-size: 1.25rem;
                font-weight: 300;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                margin-bottom: 1.5rem;
                position: relative;
                text-align: center;
            }
            
            .section-title::after {
                content: '';
                position: absolute;
                bottom: -0.5rem;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 1px;
                background: #374151;
            }
            
            .work-item, .education-item, .workshop-item {
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .item-title {
                font-size: 1.125rem;
                font-weight: 500;
                color: #374151;
                margin-bottom: 0.25rem;
            }
            
            .item-company {
                font-size: 0.875rem;
                font-weight: 300;
                color: #6b7280;
                margin-bottom: 0.25rem;
            }
            
            .item-date {
                font-size: 0.875rem;
                color: #9ca3af;
                margin-bottom: 0.75rem;
            }
            
            .item-description {
                font-size: 0.875rem;
                color: #4b5563;
                line-height: 1.6;
                white-space: pre-line;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .skills-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                text-align: left;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .skill-section {
                text-align: center;
            }
            
            .languages-list {
                list-style: none;
                padding: 0;
                text-align: center;
            }
            
            .language-item {
                font-size: 0.875rem;
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .language-name {
                font-weight: 500;
            }
            
            .additional-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 1.5rem;
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            @media print {
                .minimal-template {
                    padding: 1rem;
                    font-size: 12px;
                }
                
                .name {
                    font-size: 1.75rem;
                }
                
                .profile-image {
                    width: 4rem;
                    height: 4rem;
                }
                
                .section-title {
                    font-size: 1rem;
                }
            }
        `;
    }

    getExecutiveTemplateCSS() {
        return `
            body {
                font-family: 'Merriweather', serif;
            }
            
            .executive-template {
                font-family: 'Merriweather', serif;
                background: white;
                min-height: 100vh;
            }
            
            .executive-grid {
                display: grid;
                grid-template-columns: 1fr 3fr;
                min-height: 100vh;
            }
            
            .executive-sidebar {
                background: #047857;
                color: white;
                padding: 2rem 1.5rem;
            }
            
            .profile-image {
                width: 6rem;
                height: 6rem;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid rgba(255, 255, 255, 0.3);
                margin: 0 auto 1.5rem;
                display: block;
            }
            
            .sidebar-section {
                margin-bottom: 1.5rem;
            }
            
            .sidebar-title {
                font-size: 0.875rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.75rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
            }
            
            .sidebar-content {
                font-size: 0.875rem;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.9);
            }
            
            .contact-item {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
            }
            
            .contact-icon {
                width: 1rem;
                height: 1rem;
                flex-shrink: 0;
                margin-top: 0.125rem;
            }
            
            .skill-item {
                margin-bottom: 0.5rem;
                padding: 0.375rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .skill-name {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .languages-list {
                list-style: none;
                padding: 0;
            }
            
            .language-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.875rem;
                margin-bottom: 0.5rem;
                padding: 0.25rem 0;
            }
            
            .language-name {
                font-weight: 500;
            }
            
            .language-level {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .executive-main {
                padding: 2rem;
            }
            
            .main-header {
                margin-bottom: 2rem;
            }
            
            .name {
                font-size: 2.5rem;
                font-weight: 700;
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .title-divider {
                width: 4rem;
                height: 0.25rem;
                background: #047857;
                border-radius: 2px;
                margin-bottom: 1rem;
            }
            
            .section {
                margin-bottom: 2rem;
            }
            
            .section-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #047857;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #d1fae5;
            }
            
            .work-item, .education-item {
                margin-bottom: 1.5rem;
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;
            }
            
            .item-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: #374151;
            }
            
            .item-company {
                font-size: 0.875rem;
                font-weight: 500;
                color: #047857;
                margin-bottom: 0.25rem;
            }
            
            .item-date {
                font-size: 0.875rem;
                color: #6b7280;
                font-weight: 500;
            }
            
            .item-description {
                font-size: 0.875rem;
                color: #4b5563;
                line-height: 1.6;
                white-space: pre-line;
                text-align: justify;
            }
            
            .workshops-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .workshop-item {
                border-left: 4px solid #047857;
                padding-left: 1rem;
            }
            
            .workshop-title {
                font-weight: 500;
                color: #374151;
                margin-bottom: 0.25rem;
            }
            
            .workshop-org {
                color: #047857;
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            
            .workshop-date {
                color: #6b7280;
                font-size: 0.875rem;
            }
            
            @media print {
                .executive-template {
                    font-size: 12px;
                }
                
                .executive-sidebar {
                    background: #047857 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                .name {
                    font-size: 1.75rem;
                }
                
                .profile-image {
                    width: 5rem;
                    height: 5rem;
                }
                
                .executive-main {
                    padding: 1.5rem;
                }
                
                .workshops-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
    }

    generateTemplateHTML(resumeData, templateId) {
        const { personalDetails, informationSummary, workExperience, education, workshops, languages } = resumeData;

        switch (templateId) {
            case 'modern':
                return this.generateModernTemplate(resumeData);
            case 'minimal':
                return this.generateMinimalTemplate(resumeData);
            case 'executive':
                return this.generateExecutiveTemplate(resumeData);
            case 'classic':
            default:
                return this.generateClassicTemplate(resumeData);
        }
    }

    generateClassicTemplate(resumeData) {
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

    generateModernTemplate(resumeData) {
        const { personalDetails, informationSummary, workExperience, education, workshops, languages } = resumeData;

        return `
      <div class="modern-template">
        <!-- Header with gradient background -->
        <header class="modern-header">
          ${personalDetails?.imageUrl ? `
            <img src="${personalDetails.imageUrl}" alt="Profile Photo" class="profile-image">
          ` : ''}
          <h1 class="name">${personalDetails?.name || 'Your Name'}</h1>
          <div class="contact-info">
            ${personalDetails?.email ? `
              <span class="contact-item">
                <span>✉️</span>
                <span>${personalDetails.email}</span>
              </span>
            ` : ''}
            ${personalDetails?.phone ? `
              <span class="contact-item">
                <span>📞</span>
                <span>${personalDetails.phone}</span>
              </span>
            ` : ''}
            ${personalDetails?.address ? `
              <span class="contact-item">
                <span>📍</span>
                <span>${personalDetails.address}</span>
              </span>
            ` : ''}
          </div>
        </header>

        <!-- Two-column layout -->
        <div class="modern-content">
          <!-- Main content -->
          <div class="main-content">
            <!-- Professional Summary -->
            ${informationSummary ? `
              <section class="section">
                <h2 class="section-title">About Me</h2>
                <p class="item-description">${informationSummary}</p>
              </section>
            ` : ''}

            <!-- Work Experience -->
            ${workExperience && workExperience.length > 0 ? `
              <section class="section">
                <h2 class="section-title">Experience</h2>
                ${workExperience.map(work => `
                  <div class="work-item">
                    <div class="work-content">
                      <div class="item-header">
                        <div>
                          <div class="item-title">${work.position || 'Job Title'}</div>
                          <div class="item-company">${work.company || 'Company Name'}</div>
                        </div>
                        <div class="item-date">${work.date || 'Date Range'}</div>
                      </div>
                      ${work.description ? `<div class="item-description">${work.description}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </section>
            ` : ''}

            <!-- Education -->
            ${education && education.length > 0 ? `
              <section class="section">
                <h2 class="section-title">Education</h2>
                ${education.map(edu => `
                  <div class="work-content" style="margin-bottom: 1rem;">
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
          </div>

          <!-- Sidebar -->
          <div class="sidebar">
            <!-- Skills -->
            ${personalDetails && (personalDetails.itSkills || personalDetails.strengths) ? `
              <section class="section">
                <h2 class="sidebar-title">Skills</h2>
                ${personalDetails.itSkills ? `
                  <div style="margin-bottom: 1rem;">
                    <h4 style="font-weight: 500; color: #7c3aed; margin-bottom: 0.5rem;">Technical Skills</h4>
                    <div class="skill-tags">
                      ${personalDetails.itSkills.split(',').map(skill =>
            `<span class="skill-tag">${skill.trim()}</span>`
        ).join('')}
                    </div>
                  </div>
                ` : ''}
                ${personalDetails.strengths ? `
                  <div>
                    <h4 style="font-weight: 500; color: #7c3aed; margin-bottom: 0.5rem;">Strengths</h4>
                    <div class="skill-tags">
                      ${personalDetails.strengths.split(',').map(skill =>
            `<span class="skill-tag">${skill.trim()}</span>`
        ).join('')}
                    </div>
                  </div>
                ` : ''}
              </section>
            ` : ''}

            <!-- Languages -->
            ${languages && languages.length > 0 ? `
              <section class="section">
                <h2 class="sidebar-title">Languages</h2>
                <ul class="languages-list">
                  ${languages.map(lang => `
                    <li class="language-item">
                      <span class="language-name">${lang.name || 'Language'}</span>
                      <span class="language-level">${lang.level || 'Level'}</span>
                    </li>
                  `).join('')}
                </ul>
              </section>
            ` : ''}

            <!-- Workshops & Certifications -->
            ${workshops && workshops.length > 0 ? `
              <section class="section">
                <h2 class="sidebar-title">Certifications</h2>
                ${workshops.map(workshop => `
                  <div style="border-left: 3px solid #c084fc; padding-left: 0.75rem; margin-bottom: 0.75rem;">
                    <h4 style="font-weight: 500; color: #374151; font-size: 0.875rem; margin-bottom: 0.25rem;">
                      ${workshop.title || 'Workshop/Certification Title'}
                    </h4>
                    <p style="color: #7c3aed; font-size: 0.75rem; margin-bottom: 0.25rem;">
                      ${workshop.place || 'Organization'}
                    </p>
                    <p style="color: #6b7280; font-size: 0.75rem;">
                      ${workshop.date || 'Date'}
                    </p>
                  </div>
                `).join('')}
              </section>
            ` : ''}

            <!-- Additional Information -->
            ${personalDetails && (personalDetails.birthDate || personalDetails.nationality || personalDetails.familyStatus) ? `
              <section class="section">
                <h2 class="sidebar-title">Personal Info</h2>
                <div style="font-size: 0.875rem;">
                  ${personalDetails.birthDate ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                      <span style="color: #6b7280;">Birth Date</span>
                      <span style="color: #374151;">${personalDetails.birthDate}</span>
                    </div>
                  ` : ''}
                  ${personalDetails.nationality ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                      <span style="color: #6b7280;">Nationality</span>
                      <span style="color: #374151;">${personalDetails.nationality}</span>
                    </div>
                  ` : ''}
                  ${personalDetails.familyStatus ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                      <span style="color: #6b7280;">Status</span>
                      <span style="color: #374151;">${personalDetails.familyStatus}</span>
                    </div>
                  ` : ''}
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    }

    generateMinimalTemplate(resumeData) {
        const { personalDetails, informationSummary, workExperience, education, workshops, languages } = resumeData;

        return `
      <div class="minimal-template">
        <!-- Header - Clean and Simple -->
        <header class="minimal-header">
          ${personalDetails?.imageUrl ? `
            <img src="${personalDetails.imageUrl}" alt="Profile Photo" class="profile-image">
          ` : ''}
          <h1 class="name">${personalDetails?.name || 'Your Name'}</h1>
          <div class="contact-info">
            ${personalDetails?.email ? `
              <span class="contact-item">
                <span>✉</span>
                <span>${personalDetails.email}</span>
              </span>
            ` : ''}
            ${personalDetails?.phone ? `
              <span class="contact-item">
                <span>☎</span>
                <span>${personalDetails.phone}</span>
              </span>
            ` : ''}
            ${personalDetails?.address ? `
              <span class="contact-item">
                <span>📍</span>
                <span>${personalDetails.address}</span>
              </span>
            ` : ''}
          </div>
        </header>

        <!-- Summary -->
        ${informationSummary ? `
          <section class="section">
            <h2 class="section-title">Summary</h2>
            <p class="item-description">${informationSummary}</p>
          </section>
        ` : ''}

        <!-- Work Experience -->
        ${workExperience && workExperience.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${workExperience.map(work => `
              <div class="work-item">
                <div class="item-title">${work.position || 'Job Title'}</div>
                <div class="item-company">${work.company || 'Company Name'}</div>
                <div class="item-date">${work.date || 'Date Range'}</div>
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
                <div class="item-title">${edu.degree || 'Degree / Field of Study'}</div>
                <div class="item-company">${edu.school || 'Institution Name'}</div>
                <div class="item-date">${edu.date || 'Date Range'}</div>
                ${edu.place ? `<div class="item-description">${edu.place}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Skills & Languages -->
        <div class="skills-container">
          <!-- Skills -->
          ${personalDetails && (personalDetails.itSkills || personalDetails.strengths) ? `
            <div class="skill-section">
              <h2 class="section-title">Skills</h2>
              ${personalDetails.itSkills ? `
                <div style="margin-bottom: 1rem; text-align: center;">
                  <h4 style="font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Technical Skills</h4>
                  <p style="font-size: 0.875rem; color: #4b5563;">${personalDetails.itSkills}</p>
                </div>
              ` : ''}
              ${personalDetails.strengths ? `
                <div style="text-align: center;">
                  <h4 style="font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Strengths</h4>
                  <p style="font-size: 0.875rem; color: #4b5563;">${personalDetails.strengths}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Languages -->
          ${languages && languages.length > 0 ? `
            <div class="skill-section">
              <h2 class="section-title">Languages</h2>
              <ul class="languages-list">
                ${languages.map(lang => `
                  <li class="language-item">
                    <span class="language-name">${lang.name || 'Language'}:</span>
                    ${lang.level || 'Level'}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Workshops & Certifications -->
        ${workshops && workshops.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Workshops & Certifications</h2>
            ${workshops.map(workshop => `
              <div class="workshop-item">
                <div class="item-title">${workshop.title || 'Workshop/Certification Title'}</div>
                <div class="item-company">${workshop.place || 'Organization'}</div>
                <div class="item-date">${workshop.date || 'Date'}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        <!-- Additional Information -->
        ${personalDetails && (personalDetails.birthDate || personalDetails.nationality || personalDetails.familyStatus) ? `
          <section class="section">
            <h2 class="section-title">Additional Information</h2>
            <div class="additional-info">
              ${personalDetails.birthDate ? `<span><strong>Born:</strong> ${personalDetails.birthDate}</span>` : ''}
              ${personalDetails.nationality ? `<span><strong>Nationality:</strong> ${personalDetails.nationality}</span>` : ''}
              ${personalDetails.familyStatus ? `<span><strong>Status:</strong> ${personalDetails.familyStatus}</span>` : ''}
            </div>
          </section>
        ` : ''}
      </div>
    `;
    }

    generateExecutiveTemplate(resumeData) {
        const { personalDetails, informationSummary, workExperience, education, workshops, languages } = resumeData;

        return `
      <div class="executive-template">
        <div class="executive-grid">
          <!-- Left Sidebar -->
          <div class="executive-sidebar">
            <!-- Profile Image -->
            ${personalDetails?.imageUrl ? `
              <img src="${personalDetails.imageUrl}" alt="Profile Photo" class="profile-image">
            ` : ''}

            <!-- Contact Information -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">Contact</h3>
              <div class="sidebar-content">
                ${personalDetails?.email ? `
                  <div class="contact-item">
                    <span class="contact-icon">✉️</span>
                    <span>${personalDetails.email}</span>
                  </div>
                ` : ''}
                ${personalDetails?.phone ? `
                  <div class="contact-item">
                    <span class="contact-icon">📞</span>
                    <span>${personalDetails.phone}</span>
                  </div>
                ` : ''}
                ${personalDetails?.address ? `
                  <div class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span>${personalDetails.address}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Skills -->
            ${personalDetails && (personalDetails.itSkills || personalDetails.strengths) ? `
              <div class="sidebar-section">
                <h3 class="sidebar-title">Expertise</h3>
                <div class="sidebar-content">
                  ${personalDetails.itSkills ? `
                    <div class="skill-item">
                      <div class="skill-name">Technical Skills</div>
                      <div style="font-size: 0.75rem; line-height: 1.4; color: rgba(255, 255, 255, 0.8);">
                        ${personalDetails.itSkills}
                      </div>
                    </div>
                  ` : ''}
                  ${personalDetails.strengths ? `
                    <div class="skill-item">
                      <div class="skill-name">Core Strengths</div>
                      <div style="font-size: 0.75rem; line-height: 1.4; color: rgba(255, 255, 255, 0.8);">
                        ${personalDetails.strengths}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Languages -->
            ${languages && languages.length > 0 ? `
              <div class="sidebar-section">
                <h3 class="sidebar-title">Languages</h3>
                <ul class="languages-list">
                  ${languages.map(lang => `
                    <li class="language-item">
                      <span class="language-name">${lang.name || 'Language'}</span>
                      <span class="language-level">${lang.level || 'Level'}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Additional Information -->
            ${personalDetails && (personalDetails.birthDate || personalDetails.nationality || personalDetails.familyStatus) ? `
              <div class="sidebar-section">
                <h3 class="sidebar-title">Personal</h3>
                <div class="sidebar-content">
                  ${personalDetails.birthDate ? `
                    <div style="margin-bottom: 0.5rem;">
                      <span style="color: rgba(255, 255, 255, 0.7);">Birth Date:</span>
                      <span style="display: block;">${personalDetails.birthDate}</span>
                    </div>
                  ` : ''}
                  ${personalDetails.nationality ? `
                    <div style="margin-bottom: 0.5rem;">
                      <span style="color: rgba(255, 255, 255, 0.7);">Nationality:</span>
                      <span style="display: block;">${personalDetails.nationality}</span>
                    </div>
                  ` : ''}
                  ${personalDetails.familyStatus ? `
                    <div style="margin-bottom: 0.5rem;">
                      <span style="color: rgba(255, 255, 255, 0.7);">Status:</span>
                      <span style="display: block;">${personalDetails.familyStatus}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Main Content Area -->
          <div class="executive-main">
            <!-- Header -->
            <div class="main-header">
              <h1 class="name">${personalDetails?.name || 'Your Name'}</h1>
              <div class="title-divider"></div>
            </div>

            <!-- Executive Summary -->
            ${informationSummary ? `
              <section class="section">
                <h2 class="section-title">Executive Summary</h2>
                <p class="item-description">${informationSummary}</p>
              </section>
            ` : ''}

            <!-- Professional Experience -->
            ${workExperience && workExperience.length > 0 ? `
              <section class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${workExperience.map(work => `
                  <div class="work-item">
                    <div class="item-header">
                      <div>
                        <div class="item-title">${work.position || 'Position Title'}</div>
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
                        ${edu.place ? `<div style="color: #6b7280; font-size: 0.875rem;">${edu.place}</div>` : ''}
                      </div>
                      <div class="item-date">${edu.date || 'Date Range'}</div>
                    </div>
                  </div>
                `).join('')}
              </section>
            ` : ''}

            <!-- Professional Development -->
            ${workshops && workshops.length > 0 ? `
              <section class="section">
                <h2 class="section-title">Professional Development</h2>
                <div class="workshops-grid">
                  ${workshops.map(workshop => `
                    <div class="workshop-item">
                      <div class="workshop-title">${workshop.title || 'Workshop/Certification Title'}</div>
                      <div class="workshop-org">${workshop.place || 'Organization'}</div>
                      <div class="workshop-date">${workshop.date || 'Date'}</div>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    }
}

module.exports = PDFGeneratorService;
