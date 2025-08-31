export interface CommunicationItem {
  id: string;
  title: string;
  referenceNumber: string;
  type: 'Referral' | 'Letter';
  team: 'Far North' | 'Central West';
  dateReceived: Date;
  daysSinceReceived: number;
  status: 'Awaiting Action' | 'Actioned' | 'Overdue';
  overdueDay?: number;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  medicareNumber: string;
  gender: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Clinician {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  clinic: string;
  email: string;
  phone: string;
}