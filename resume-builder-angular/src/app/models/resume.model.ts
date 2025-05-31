import { PersonalDetails } from './personal-details.model';
import { Language } from './language.model';
import { WorkExperience } from './work-experience.model';
import { Workshop } from './workshop.model';
import { Education } from './education.model';

export interface Resume {
  personalDetails: PersonalDetails;
  informationSummary: string;
  languages: Language[];
  workExperience: WorkExperience[];
  workshops: Workshop[];
  education: Education[];
}
