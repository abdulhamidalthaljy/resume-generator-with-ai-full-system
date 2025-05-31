import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor() {}

  private cleanResponse(text: string): string {
    // Remove markdown code block syntax if present
    return text
      .replace(/```json\n/g, '') // Remove opening ```json
      .replace(/```\n/g, '') // Remove opening ``` without json
      .replace(/```/g, '') // Remove closing ```
      .trim(); // Remove any extra whitespace
  }

  private async makeRequest(prompt: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const rawText = response.data.candidates[0].content.parts[0].text;
      return this.cleanResponse(rawText);
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

  async generatePersonalDetails(userInput: string) {
    const prompt = `Based on this information: "${userInput}", generate a professional resume personal details section. 
    Return ONLY a valid JSON object with the following fields (no additional text or explanation):
    {
      "name": "Full Name",
      "birthDate": "DD.MM.YYYY",
      "address": "Full Address",
      "familyStatus": "Marital Status",
      "email": "professional email",
      "phone": "phone number",
      "nationality": "nationality",
      "itSkills": "relevant IT skills",
      "strengths": "key professional strengths"
    }`;

    try {
      const content = await this.makeRequest(prompt);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating personal details:', error);
      throw error;
    }
  }

  async generateInformationSummary(userInput: string) {
    const prompt = `Based on this information: "${userInput}", generate a professional and compelling career summary or personal statement for a resume. 
    The summary should be 2-3 sentences long and highlight key qualifications, experience, and career goals. Return ONLY the summary text, no additional explanation.`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error generating information summary:', error);
      throw error;
    }
  }

  async generateWorkExperience(userInput: string) {
    const prompt = `Based on this information: "${userInput}", generate professional work experience entries.
    Return ONLY a valid JSON array with objects containing the following fields (no additional text or explanation):
    [{
      "company": "Company Name",
      "position": "Job Title",
      "date": "Duration of Employment",
      "description": "Key responsibilities and achievements"
    }]`;

    try {
      const content = await this.makeRequest(prompt);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating work experience:', error);
      throw error;
    }
  }

  async generateEducation(userInput: string) {
    const prompt = `Based on this information: "${userInput}", generate education history entries.
    Return ONLY a valid JSON array with objects containing the following fields (no additional text or explanation):
    [{
      "school": "Institution Name",
      "degree": "Degree/Certificate Name",
      "place": "Location",
      "date": "Duration of Study"
    }]`;

    try {
      const content = await this.makeRequest(prompt);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating education:', error);
      throw error;
    }
  }

  async generateLanguages(userInput: string) {
    const prompt = `Based on this information: "${userInput}", list language proficiencies.
    Return ONLY a valid JSON array with objects containing the following fields (no additional text or explanation):
    [{
      "name": "Language Name",
      "level": "Proficiency Level (e.g., Native, Fluent, Intermediate, Basic)"
    }]`;

    try {
      const content = await this.makeRequest(prompt);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating languages:', error);
      throw error;
    }
  }
}
 