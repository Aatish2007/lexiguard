export interface SampleContract {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
}

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'sample-rent-noida',
    name: 'Noida 11-Month Residential Rent Agreement',
    category: 'Rent Agreement',
    description: 'Contains high-risk unfair clauses: immediate 24-hour eviction, arbitrary 100% deposit forfeiture, and illegal utility disconnection.',
    content: `RENT AGREEMENT / LEASE DEED
This Rent Agreement is made and executed on this 1st day of August, 2024 at Noida, Uttar Pradesh between:
Mr. Jagdish Sharma, R/o Flat No. 902, Tower B, Supertech Ecovillage, Greater Noida West (hereinafter called the "LANDLORD")
AND
Ms. Ananya Roy, D/o Sri Subir Roy, working at Tech Mahindra, Sector 62, Noida (hereinafter called the "TENANT").

WHEREAS the Landlord is the absolute lawful owner of the residential flat located at Flat 404, Tower C, Prateek Fedora, Sector 120, Noida (hereinafter referred to as the "Premises").
AND WHEREAS the Tenant has approached the Landlord to let out the said premises for 11 months on monthly rent of Rs. 24,000/- (Rupees Twenty-Four Thousand only).

NOW THIS DEED WITNESSETH AS UNDER:
1. TENURE: The tenancy shall be for a period of 11 months commencing from 01.08.2024.
2. SECURITY DEPOSIT: The Tenant has deposited Rs. 72,000/- (Three Months Rent) as interest-free security deposit.
3. FORFEITURE CLAUSE (ARBITRARY): If the Tenant vacates the flat before 11 months for ANY reason whatsoever, or in case of any disagreement, the entire security deposit of Rs. 72,000/- shall be forfeited unconditionally by the Landlord without any obligation to prove actual damage.
4. EVICTION AT WILL: The Landlord reserves the absolute right to demand immediate possession of the premises by giving 24 hours verbal or WhatsApp notice. The Tenant shall vacate within 24 hours failing which the Landlord shall change the locks and throw the Tenant's belongings onto the street.
5. UTILITY CUT-OFF: If rent is delayed by more than 3 days past the 5th of each month, the Landlord shall have the right to disconnect electricity and municipal water supply without notice.
6. NO NOTICE BY TENANT: The Tenant cannot terminate this agreement before 11 months. If Tenant vacates, Tenant must pay the rent for the entire remaining period of 11 months.
7. JURISDICTION: Exclusive jurisdiction shall lie solely with the Landlord's preferred panchayat/arbitrator whose fee of Rs. 25,000 shall be borne solely by the Tenant.`
  },
  {
    id: 'sample-employment-bengaluru',
    name: 'Bengaluru Startup Employment Offer Letter',
    category: 'Employment Letter',
    description: 'Contains unlawful Section 27 restraint of trade (2-year non-compete across all tech), a ₹5 Lakh employment training bond, and 90-day unilateral notice.',
    content: `PRIVATE & CONFIDENTIAL - EMPLOYMENT AGREEMENT & OFFER LETTER
Date: 15th January 2025
To: Rahul Nair, Software Development Engineer
Company: CloudScale Nexa Technologies Private Limited, Indiranagar, Bengaluru - 560038

Dear Rahul,
We are pleased to offer you the position of Senior Full-Stack Engineer at CloudScale Nexa Technologies Pvt Ltd ("Company").

TERMS AND CONDITIONS OF EMPLOYMENT:
1. COMPENSATION: Fixed CTC of INR 16,00,000 per annum, paid monthly in arrears.
2. PROBATION & NOTICE PERIOD: You will be on probation for 6 months. During or after probation, the Company may terminate your employment with 24 hours notice or pay in lieu. However, the Employee must give a mandatory 90 (Ninety) days written notice and cannot buy out the notice period.
3. EMPLOYMENT TRAINING BOND & PENALTY: The Employee agrees to serve the Company for a minimum lock-in period of 36 months. If the Employee resigns, discontinues, or is terminated for any reason prior to 36 months, the Employee shall pay an unconditional penalty of INR 5,00,000/- (Five Lakh Rupees) to the Company, and the Company shall withhold all experience letters, PF clearances, and relieving certificates until such amount is deposited.
4. NON-COMPETE COVENANT (RESTRAINT OF TRADE): For a period of 24 (twenty-four) months following separation from the Company, the Employee shall NOT work for, consult, advise, or join ANY software, IT, cloud, or internet technology company anywhere within the territory of India or worldwide.
5. INTELLECTUAL PROPERTY: Any idea, patent, software code, or creative work conceived by the Employee, whether during working hours or during weekends/personal time on personal equipment, shall be the sole and exclusive property of the Company in perpetuity.
6. SALARY DEDUCTIONS: The Company reserves the right to deduct up to 40% of monthly salary for any perceived project delivery delays at the manager's sole discretion.`
  },
  {
    id: 'sample-freelance-mumbai',
    name: 'Freelance UI/UX Design & Development Agreement',
    category: 'Freelance Contract',
    description: 'Contains unfair client clauses: unlimited free revisions, indefinite payment delays, and IP transfer prior to payment.',
    content: `FREELANCE SERVICES CONTRACT
Date: October 10, 2024
Client: Apex Global Retail Pvt Ltd, Bandra Kurla Complex, Mumbai
Service Provider / Designer: Tanvi Deshmukh (Freelance UI/UX Specialist), Pune

1. SCOPE OF SERVICES: The Designer shall create full mobile and web UI/UX screens, wireframes, and design system for the Client's e-commerce platform.
2. PAYMENT TERMS: Total fee of INR 1,20,000/-. Advance payment: INR 0/- (Zero). The entire payment of INR 1,20,000/- shall be paid "only after the Client has achieved full launch and is 100% satisfied with commercial market performance" (estimated 90-180 days after delivery).
3. UNLIMITED REVISIONS: The Designer shall provide unlimited modifications, redesigns, and alterations at no extra charge until the Client approves in writing.
4. IMMEDIATE IP ASSIGNMENT: All copyrights, trademarks, design source files (Figma/Adobe), and intellectual property shall be transferred to the Client immediately upon creation, irrespective of whether the fee has been paid or defaulted.
5. CANCELLATION: The Client may cancel this contract at any point without prior notice and without paying any cancellation fee or compensation for work completed up to that date.`
  }
];
