-- Seed some sample jobs
INSERT INTO jobs (title, description, location, country, region, industry, employment_type, salary_range, requirements, benefits, is_active) VALUES
-- Europe
('Senior Construction Manager', 'Lead construction projects across multiple sites. Manage teams, budgets, and timelines for large-scale commercial developments.', 'Berlin', 'Germany', 'europe', 'construction', 'full_time', '€70,000 - €90,000', 'Minimum 10 years construction management experience. Valid construction management certification. Fluent in English and German.', 'Company car, health insurance, pension scheme, relocation assistance', true),

('Warehouse Operations Supervisor', 'Oversee daily warehouse operations including inventory management, staff scheduling, and logistics coordination.', 'Amsterdam', 'Netherlands', 'europe', 'warehousing', 'full_time', '€45,000 - €55,000', '5+ years warehouse experience. Strong leadership skills. Forklift certification preferred.', 'Health insurance, annual bonus, career development programs', true),

('Food Production Technician', 'Monitor and maintain food production equipment. Ensure quality control standards are met throughout the production process.', 'Warsaw', 'Poland', 'europe', 'food_production', 'full_time', '€35,000 - €42,000', 'Food safety certification. 3+ years in food manufacturing. Knowledge of HACCP standards.', 'Meal allowance, shift premiums, training opportunities', true),

-- Middle East
('Civil Engineer', 'Design and oversee construction of infrastructure projects. Work with international teams on major developments.', 'Dubai', 'UAE', 'middle_east', 'engineering', 'full_time', 'AED 25,000 - 35,000/month', 'Bachelor degree in Civil Engineering. 5+ years experience. AutoCAD and project management skills.', 'Tax-free salary, accommodation allowance, annual flights home, health insurance', true),

('Healthcare Administrator', 'Manage hospital department operations. Coordinate staff schedules, patient flow, and administrative processes.', 'Riyadh', 'Saudi Arabia', 'middle_east', 'health', 'full_time', 'SAR 20,000 - 28,000/month', 'Healthcare management degree. 5+ years hospital administration experience. Arabic language skills advantageous.', 'Accommodation provided, health insurance, annual leave, end of service benefits', true),

('Construction Site Supervisor', 'Supervise construction activities on mega projects. Ensure safety compliance and quality standards.', 'Doha', 'Qatar', 'middle_east', 'construction', 'contract', 'QAR 18,000 - 25,000/month', '8+ years construction experience. Safety certifications. Experience with large-scale projects.', 'Furnished accommodation, transport, medical insurance, project completion bonus', true),

-- Asia
('Mechanical Engineer', 'Design and develop mechanical systems for manufacturing facilities. Lead engineering projects from concept to completion.', 'Singapore', 'Singapore', 'asia', 'engineering', 'full_time', 'SGD 6,000 - 8,500/month', 'Mechanical Engineering degree. 4+ years experience. Proficient in SolidWorks and AutoCAD.', 'CPF contributions, medical benefits, annual bonus, professional development', true),

('Registered Nurse', 'Provide patient care in modern hospital setting. Work with international medical team on various departments.', 'Manila', 'Philippines', 'asia', 'health', 'full_time', 'PHP 45,000 - 65,000/month', 'Nursing degree and valid license. Minimum 2 years clinical experience. BLS certification.', 'HMO coverage, housing assistance, continuing education support', true),

('Warehouse Team Leader', 'Lead warehouse team in e-commerce fulfillment center. Manage picking, packing, and shipping operations.', 'Bangkok', 'Thailand', 'asia', 'warehousing', 'full_time', 'THB 35,000 - 45,000/month', '3+ years warehouse experience. Team leadership skills. Basic English communication.', 'Social security, annual bonus, meal allowance, transportation', true),

('Food Quality Manager', 'Ensure food safety standards across production facilities. Lead quality assurance team and manage certifications.', 'Ho Chi Minh City', 'Vietnam', 'asia', 'food_production', 'full_time', 'VND 30,000,000 - 45,000,000/month', 'Food Science degree. ISO 22000 knowledge. 5+ years in food industry.', 'Health insurance, performance bonus, career advancement opportunities', true);
