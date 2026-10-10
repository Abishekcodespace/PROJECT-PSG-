import { DatasetItem } from '../types/audit';

export const SAMPLE_DATASET: DatasetItem[] = [
  // ==========================================
  // FINANCIAL SERVICES (20 Cases)
  // ==========================================
  {
    id: 'FIN-01',
    industry: 'Financial Services',
    title: 'FastCash Personal Loans - Same-Day Approval',
    adHeadline: 'Get Approved on the Same Day | Loans from $1,000 to $50,000',
    adDescription: 'Fast, secure personal loan approval within 24 hours. No hidden origination fees, apply online in 2 minutes.',
    adCta: 'Apply in 2 Minutes',
    landingPageUrl: 'https://fastcashloans.com/personal-loans',
    snapshotHtml: `<!DOCTYPE html><html><head><title>FastCash Personal Loans - Flexible Financing</title></head><body>
      <header><nav><a href="/">FastCash</a></nav></header>
      <section class="hero">
        <h1>Flexible Personal Loans Up To $50,000</h1>
        <p>Borrow money for debt consolidation, home renovation, or unexpected medical expenses with fixed monthly payments.</p>
        <button class="btn-primary">Check Your Rate</button>
      </section>
      <section class="features">
        <h2>Why Borrow with FastCash?</h2>
        <p>Fixed interest rates from 6.99% APR. Transparent terms with zero prepayment penalties.</p>
        <p>Loan amounts tailored from $1,000 up to $50,000 for qualified applicants.</p>
      </section>
      <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <p>Q: How long does the approval process take? A: Applications are thoroughly reviewed by our underwriting team within 3 to 5 business days after document submission.</p>
      </section>
      <footer>
        <p>© 2026 FastCash Financial Corp. All loans subject to credit verification and income assessment.</p>
      </footer></body></html>`,
    expectedIssue: 'Missing promise & contradiction: Ad claims same-day approval, but landing page FAQ explicitly specifies 3 to 5 business days.',
    description: 'Ad promises same-day funding, but page states 3-5 business days approval timeline.',
  },
  {
    id: 'FIN-02',
    industry: 'Financial Services',
    title: 'Summit Mortgage - 3.5% Fixed Rate Promise',
    adHeadline: 'Refinance Today at 3.5% Fixed APR | Save Hundreds Monthly',
    adDescription: 'Lock in 3.5% 30-year fixed refinance rates before they go up. Zero closing cost options available.',
    adCta: 'Lock Your 3.5% Rate',
    landingPageUrl: 'https://summitmortgage.com/refinance',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Summit Mortgage Refinance Rates</title></head><body>
      <header><div class="logo">Summit Mortgage</div></header>
      <section class="hero">
        <h1>Modern Home Mortgage Refinancing</h1>
        <p>Lower your monthly mortgage payments with our streamlined digital refinancing process.</p>
        <button>Calculate Savings</button>
      </section>
      <section class="pricing">
        <h2>Today's Refinance Interest Rates</h2>
        <p>30-Year Fixed Refinance: Current rate 5.85% APR (Effective October 2026).</p>
        <p>15-Year Fixed Refinance: Current rate 5.15% APR.</p>
      </section>
      <footer>
        <p>Summit Mortgage NMLS #19482. Rates subject to daily market fluctuation. 3.5% rates reflect historical 2021 market averages and are no longer active.</p>
      </footer></body></html>`,
    expectedIssue: 'Offer & rate contradiction: Ad promises 3.5% APR fixed, but page explicitly lists 5.85% APR.',
    description: 'Blatant interest rate discrepancy between teaser ad and actual pricing grid.',
  },
  {
    id: 'FIN-03',
    industry: 'Financial Services',
    title: 'Nova Business Checking - $500 Signup Bonus',
    adHeadline: 'Open a Nova Business Account & Get $500 Cash Bonus',
    adDescription: 'No monthly fees, free unlimited ACH transfers, and $500 deposited directly into your new business account.',
    adCta: 'Claim $500 Bonus',
    landingPageUrl: 'https://novabank.com/business-checking',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Nova Business Checking - Fee-Free Banking</title></head><body>
      <header><span>Nova Bank</span></header>
      <section class="hero">
        <h1>Smart Business Banking Built For Modern Teams</h1>
        <p>Enjoy fee-free business checking with unlimited debit transactions, seamless integrations with QuickBooks, and high-yield interest on reserves.</p>
        <a class="cta" href="/signup">Open Free Account</a>
      </section>
      <section class="features">
        <h2>Features Designed for Growth</h2>
        <p>Zero monthly maintenance fees with no minimum balance requirements. Unlimited free domestic ACH transfers and mobile check deposits.</p>
      </section>
      <footer>
        <p>Nova Bank Member FDIC. *To qualify for the $500 cash bonus, account holder must maintain a daily qualifying balance of $75,000 or greater for 90 consecutive calendar days and complete 15 debit transactions.</p>
      </footer></body></html>`,
    expectedIssue: 'Position mismatch & missing context: The advertised $500 bonus is entirely absent from the hero/body and only appears as a restrictive condition buried in the footer disclaimer.',
    description: 'High bonus advertised without qualifying context, relegated only to legal footer.',
  },
  {
    id: 'FIN-04',
    industry: 'Financial Services',
    title: 'Aura Credit Card - No Annual Fee & 3% Cashback',
    adHeadline: 'Aura Cash Rewards: 3% Unlimited Cashback | $0 Annual Fee',
    adDescription: 'Earn 3% cash back on all dining, travel, and groceries with no annual fees and zero foreign transaction fees.',
    adCta: 'Apply for Aura Card',
    landingPageUrl: 'https://auracard.com/cash-rewards',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Aura Cash Rewards Card</title></head><body>
      <header><span class="brand">Aura</span></header>
      <section class="hero">
        <h1>Aura Cash Rewards: 3% Unlimited Cashback</h1>
        <p>Earn unlimited 3% cash back on all dining, grocery, and travel expenses every single day with $0 annual fee.</p>
        <button class="btn">Apply for Aura Card</button>
      </section>
      <section class="features">
        <h2>Premium Perks Without The High Cost</h2>
        <p>Enjoy $0 annual fee forever, zero foreign transaction fees, and instant card access via Apple Wallet and Google Pay.</p>
        <p>Redeem cash back directly for statement credits or direct deposit.</p>
      </section>
      <footer><p>© 2026 Aura Financial. Variable APR 19.99%-27.99% based on creditworthiness.</p></footer></body></html>`,
    expectedIssue: 'Supported hero match: Full message match across headline, cashback rates, zero annual fee, and CTA.',
    description: 'Perfect alignment benchmark test.',
  },
  {
    id: 'FIN-05',
    industry: 'Financial Services',
    title: 'Apex Student Loan - 0.25% Auto-Pay Discount',
    adHeadline: 'Refinance Student Loans & Lower Your Monthly Payments',
    adDescription: 'Cut student loan debt fast with flexible 5 to 20 year terms. Save an extra 0.25% APR with automatic payments enabled.',
    adCta: 'See My Custom Rate',
    landingPageUrl: 'https://apexloans.com/student-refinance',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Apex Student Refinance</title></head><body>
      <section class="hero">
        <h1>Refinance Your Private and Federal Student Loans</h1>
        <p>Consolidate multiple high-interest school loans into one simple, manageable monthly payment with fixed rates starting at 4.25% APR.</p>
        <button>See My Custom Rate</button>
      </section>
      <section class="features">
        <h2>Repayment Terms to Fit Your Life</h2>
        <p>Choose flexible terms from 5, 7, 10, 15, or 20 years. Receive an automatic 0.25% interest rate deduction when you enroll in monthly Auto-Pay.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Auto-pay discount, flexible terms, and rate check CTA verified.',
    description: 'Well-aligned financial services refinancing ad.',
  },
  {
    id: 'FIN-06',
    industry: 'Financial Services',
    title: 'BlueStone Wealth - Zero Commission Stock Trading',
    adHeadline: 'Trade Global Stocks with $0 Commission & Free Real-Time Data',
    adDescription: 'Execute stock and options trades with zero commission fees. Instant deposits and institutional grade charting tools.',
    adCta: 'Start Trading Free',
    landingPageUrl: 'https://bluestonetrading.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>BlueStone Wealth Management</title></head><body>
      <section class="hero">
        <h1>Wealth Management for Accredited Investors</h1>
        <p>We provide comprehensive portfolio management and estate planning services for high net worth families ($1M+ minimum AUM).</p>
        <button>Schedule Private Consultation</button>
      </section>
      <section class="pricing">
        <h2>Advisory Fees</h2>
        <p>Annual wealth advisory fee: 0.85% of assets under management. Custodial brokerage transaction fees apply per trade ticket.</p>
      </section></body></html>`,
    expectedIssue: 'Severe contradiction: Ad advertises self-directed $0 commission stock trading, but landing page is an accredited wealth management advisory with $1M minimum.',
    description: 'Wrong landing page destination for retail ad campaign.',
  },
  {
    id: 'FIN-07',
    industry: 'Financial Services',
    title: 'ClearDebt Relief - Settle Debt for 50% Less',
    adHeadline: 'Reduce Credit Card Debt by 50% or More in 24 to 48 Months',
    adDescription: 'Get relief from overwhelming credit card balances. Resolve debt legally without bankruptcy.',
    adCta: 'Get Free Debt Analysis',
    landingPageUrl: 'https://cleardebt.org/program',
    snapshotHtml: `<!DOCTYPE html><html><head><title>ClearDebt Programs</title></head><body>
      <section class="hero">
        <h1>Take Control of Unsecured Consumer Debt</h1>
        <p>Our structured debt resolution programs help consumers regain financial independence with dedicated counseling.</p>
        <button>Get Free Debt Analysis</button>
      </section>
      <section class="features">
        <p>Programs typically resolve outstanding balances within 24 to 48 months depending on creditor cooperation and client savings consistency.</p>
      </section>
      <footer>
        <p>*ClearDebt does not guarantee specific reduction percentages. Clients who complete the program resolve an average of 48% of enrolled debt before service fees.</p>
      </footer></body></html>`,
    expectedIssue: 'Missing context: Ad advertises 50% debt reduction as a standard promise, but page footnotes state this is an average before fees and not guaranteed.',
    description: 'Regulated debt relief claim requires explicit qualification.',
  },
  {
    id: 'FIN-08',
    industry: 'Financial Services',
    title: 'Zenith High Yield Savings - 5.25% APY Guarantee',
    adHeadline: 'Earn 5.25% APY on Savings | No Minimums, No Fees',
    adDescription: 'Grow your cash 10x faster than traditional banks with Zenith High-Yield Savings. FDIC insured up to $250,000.',
    adCta: 'Open Savings Account',
    landingPageUrl: 'https://zenithbank.com/savings',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Zenith Savings Accounts</title></head><body>
      <section class="hero">
        <h1>Zenith High-Yield Savings: 5.25% APY</h1>
        <p>Earn an industry-leading 5.25% Annual Percentage Yield on every dollar. No monthly maintenance fees and no minimum deposit.</p>
        <button>Open Savings Account</button>
      </section>
      <section class="features">
        <p>FDIC insured up to $250,000 per depositor. Withdraw anytime with fee-free electronic transfers.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Rate, FDIC insurance, fee-free claims substantiated in hero and body.',
    description: 'High alignment banking promotion.',
  },
  {
    id: 'FIN-09',
    industry: 'Financial Services',
    title: 'Eagle Auto Loan - Rates from 2.99%',
    adHeadline: 'Auto Loans Starting at 2.99% APR | New & Used Vehicles',
    adDescription: 'Finance your next car purchase or refinance an existing auto loan today. Instant pre-qualification with no impact to credit score.',
    adCta: 'Pre-Qualify Now',
    landingPageUrl: 'https://eagleautofinance.com/rates',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Eagle Auto Finance Rates</title></head><body>
      <section class="hero">
        <h1>Competitive Auto Loans and Refinance</h1>
        <p>Get behind the wheel with competitive financing tailored to your budget.</p>
        <button>Pre-Qualify Now</button>
      </section>
      <section class="pricing">
        <h2>Current Auto Loan APR Tiers</h2>
        <p>New Vehicle Financing: Rates starting at 4.79% APR for 36-month terms.</p>
        <p>Used Vehicle Financing: Rates starting at 5.49% APR.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch: Ad advertises 2.99% APR, but landing page rate table begins at 4.79% APR.',
    description: 'Stale interest rate in ad campaign creative.',
  },
  {
    id: 'FIN-10',
    industry: 'Financial Services',
    title: 'Guardian Term Life - $1 Million Policy for $19/mo',
    adHeadline: '$1,000,000 Term Life Insurance from Only $19/Month',
    adDescription: 'Protect your family with affordable 20-year term coverage. No medical exam required for qualifying ages 18-50.',
    adCta: 'Get Free Life Quote',
    landingPageUrl: 'https://guardianlife.com/term',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Guardian Life Insurance</title></head><body>
      <section class="hero">
        <h1>Reliable Term Life Insurance For Your Family</h1>
        <p>Lock in financial security for your loved ones with policy options ranging up to $2,000,000 in coverage.</p>
        <button>Get Free Life Quote</button>
      </section>
      <section class="pricing">
        <p>Sample rates: Healthy 30-year-old non-smoker 20-year term $500,000 policy starts at $28/month. $1,000,000 coverage starts at $44/month.</p>
      </section>
      <section class="features">
        <p>Medical exam waiver available for select applicants depending on age and medical history questionnaire.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch & unsupported claim: Ad claims $1M policy for $19/mo, but actual pricing chart shows $1M policy starts at $44/mo.',
    description: 'Misleading teaser pricing that conflicts with published rate cards.',
  },
  {
    id: 'FIN-11',
    industry: 'Financial Services',
    title: 'Vanguard Crypto IRA - Zero Setup Fees',
    adHeadline: 'Invest in Bitcoin & Crypto Inside Your Tax-Free Roth IRA',
    adDescription: 'Diversify your retirement portfolio with physical cryptocurrency. Zero account setup fees, institutional cold storage security.',
    adCta: 'Open Crypto IRA',
    landingPageUrl: 'https://retirecrypto.io/ira',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Digital Asset IRA Solutions</title></head><body>
      <section class="hero">
        <h1>Diversify Your Retirement with Digital Assets</h1>
        <p>Buy and hold leading cryptocurrencies in tax-advantaged Traditional and Roth IRAs.</p>
        <button>Open Crypto IRA</button>
      </section>
      <section class="pricing">
        <p>Account setup fee: One-time custodian onboarding fee of $250. Monthly custody fee: $20/month.</p>
      </section></body></html>`,
    expectedIssue: 'Contradictory fee terms: Ad promises $0 setup fees, landing page charges $250 custodian onboarding fee.',
    description: 'Explicit fee contradiction.',
  },
  {
    id: 'FIN-12',
    industry: 'Financial Services',
    title: 'SwiftPay Merchant Services - 0.5% Processing Fee',
    adHeadline: 'Accept Credit Cards at 0.5% Flat Rate | Free POS Terminal',
    adDescription: 'Switch to SwiftPay merchant processing and cut payment gateway costs. Includes free wireless EMV terminal with next-day payouts.',
    adCta: 'Claim Free POS Terminal',
    landingPageUrl: 'https://swiftpay.com/merchants',
    snapshotHtml: `<!DOCTYPE html><html><head><title>SwiftPay Merchant Services</title></head><body>
      <section class="hero">
        <h1>Transparent Payment Processing For Retail & Restaurants</h1>
        <p>Simple point of sale systems with next-day bank settlements and dedicated technical support.</p>
        <button>Contact Sales</button>
      </section>
      <section class="pricing">
        <p>Standard processing: Interchange-plus pricing model starting at 1.8% + $0.15 per transaction. Hardware leases from $39/month.</p>
      </section></body></html>`,
    expectedIssue: 'Severe contradiction & CTA mismatch: Ad offers 0.5% flat rate + free hardware + Claim CTA; page shows 1.8% + $39/mo terminal lease + Contact Sales CTA.',
    description: 'Triple mismatch on rate, hardware offer, and conversion flow.',
  },
  {
    id: 'FIN-13',
    industry: 'Financial Services',
    title: 'Kite Home Equity - $0 Appraisal Fee Promo',
    adHeadline: 'Tap Into Your Home Equity | Zero Appraisal Fees This Month',
    adDescription: 'Unlock up to $250,000 in cash from your home equity. We waive 100% of appraisal and closing costs for applications submitted this week.',
    adCta: 'Apply for HELOC',
    landingPageUrl: 'https://kiteheloc.com/promo',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Kite HELOC Promotion</title></head><body>
      <section class="hero">
        <h1>Unlock Your Home Equity with Zero Appraisal Fees</h1>
        <p>Access up to $250,000 for home updates or tuition. We are waiving all appraisal fees for applications completed this month.</p>
        <button>Apply for HELOC</button>
      </section>
      <section class="features">
        <p>Variable rates from prime + 0.5%. Funds accessible via debit card or online transfer.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: $0 appraisal fee promo and HELOC terms substantiated in hero.',
    description: 'Consistent promotional campaign.',
  },
  {
    id: 'FIN-14',
    industry: 'Financial Services',
    title: 'Prime Capital - Guaranteed 12% Annualized Return',
    adHeadline: 'Earn Guaranteed 12% Fixed Returns with Prime Private Credit',
    adDescription: 'Back collateralized real estate loans with guaranteed 12% annualized yield. Monthly dividend payouts deposited to your bank.',
    adCta: 'Invest Today',
    landingPageUrl: 'https://primecapitalfund.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Prime Capital Real Estate Debt Fund</title></head><body>
      <section class="hero">
        <h1>Private Debt Fund for Qualified Investors</h1>
        <p>Our diversified real estate debt vehicle targets risk-adjusted quarterly distributions.</p>
        <button>Download Fund Prospectus</button>
      </section>
      <section class="features">
        <p>Target net return: 8.5% - 10.2% annualized historical target. Investments are speculative and returns are not guaranteed or FDIC insured.</p>
      </section></body></html>`,
    expectedIssue: 'Regulated claim violation & contradictory yield: Ad claims "guaranteed 12% returns", while page states returns are speculative, not guaranteed, and target 8.5%-10.2%.',
    description: 'High-risk compliance mismatch on financial guarantees.',
  },
  {
    id: 'FIN-15',
    industry: 'Financial Services',
    title: 'PayCheck Advance - $0 Interest Emergency Cash',
    adHeadline: 'Instant Cash Advance Up to $500 | 0% Interest Always',
    adDescription: 'Cover unexpected expenses between paychecks. No credit check, no interest, and no mandatory subscription fees.',
    adCta: 'Get $500 Advance',
    landingPageUrl: 'https://paycheckadvance.app',
    snapshotHtml: `<!DOCTYPE html><html><head><title>PayCheck Advance App</title></head><body>
      <section class="hero">
        <h1>Fair Financial Bridge Between Paydays</h1>
        <p>Access earned wages early without predatory payday loan interest.</p>
        <button>Download App</button>
      </section>
      <section class="features">
        <p>Advances up to $250 available to qualifying recurring payroll direct-deposit users. Optional tip feature applies.</p>
      </section>
      <footer>
        <p>Express instant disbursement fee: $6.99 per transfer. Standard ACH delivery takes 3 business days.</p>
      </footer></body></html>`,
    expectedIssue: 'Offer mismatch: Ad claims $500 advance with instant zero fee, but page caps advance at $250 and charges $6.99 for instant disbursement.',
    description: 'Discrepancy in advance limit and hidden instant delivery fee.',
  },
  {
    id: 'FIN-16',
    industry: 'Financial Services',
    title: 'TrueNorth Credit Repair - Erase Late Payments in 30 Days',
    adHeadline: 'Remove Negative Credit Items in 30 Days Guaranteed',
    adDescription: 'Our certified specialists dispute late payments, collections, and charge-offs. Boost your FICO score by 100+ points or your money back.',
    adCta: 'Fix My Credit',
    landingPageUrl: 'https://truenorthcredit.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>TrueNorth Credit Advisory</title></head><body>
      <section class="hero">
        <h1>Comprehensive Credit Report Audit & Dispute Guidance</h1>
        <p>We help consumers review credit reports for reporting inaccuracies under the Fair Credit Reporting Act.</p>
        <button>Schedule Consultation</button>
      </section>
      <section class="body">
        <p>Dispute timelines typically take 60 to 180 days across credit bureaus. Credit scores depend on numerous unique factors and specific score increases cannot be legally guaranteed.</p>
      </section></body></html>`,
    expectedIssue: 'Unsupported guarantee: Ad promises 30-day removal and 100-point boost; page notes disputes take 60-180 days and disclaims score guarantees.',
    description: 'Unsubstantiated speed and outcome guarantees.',
  },
  {
    id: 'FIN-17',
    industry: 'Financial Services',
    title: 'Solidus Gold IRA - Free $10,000 in Silver with Rollover',
    adHeadline: 'Protect Your Wealth with Physical Gold | Free $10,000 in Silver',
    adDescription: 'Roll over your 401(k) or IRA into physical precious metals. Get up to $10,000 in free bonus silver on eligible accounts.',
    adCta: 'Claim Free Silver Kit',
    landingPageUrl: 'https://solidusgold.com/rollover',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Solidus Precious Metals IRA Rollover</title></head><body>
      <section class="hero">
        <h1>Safeguard Your Retirement With Physical Gold & Silver</h1>
        <p>Transfer existing retirement funds into IRS-approved depository vaults with our specialist team.</p>
        <button>Claim Free Silver Kit</button>
      </section>
      <section class="features">
        <h2>Special Promotion</h2>
        <p>Receive up to $10,000 in promotional bullion silver when rolling over an eligible IRA or 401(k) balance exceeding $100,000.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match with context: Bonus silver promotion substantiated in feature section.',
    description: 'Aligned precious metals promotional landing page.',
  },
  {
    id: 'FIN-18',
    industry: 'Financial Services',
    title: 'Verve Small Business Line of Credit - Approval in 10 Mins',
    adHeadline: 'Revolving Business Line of Credit Up to $150K in 10 Minutes',
    adDescription: 'Get flexible revolving credit for inventory, payroll, and seasonal cash flow. Soft credit check to see initial pre-approval.',
    adCta: 'Check Business Eligibility',
    landingPageUrl: 'https://vervecredit.com/business',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Verve Business Capital</title></head><body>
      <section class="hero">
        <h1>Revolving Credit Lines Designed For Small Businesses</h1>
        <p>Access credit lines from $10,000 to $150,000. Apply online in minutes with soft pull credit review.</p>
        <button>Check Business Eligibility</button>
      </section>
      <section class="features">
        <p>Automated pre-approval decisions delivered in as little as 10 minutes during standard business hours.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Credit limit, 10-minute speed, soft pull, and CTA match perfectly.',
    description: 'High match financial services copy.',
  },
  {
    id: 'FIN-19',
    industry: 'Financial Services',
    title: 'Zenith Tax Relief - Stop IRS Levies Instantly',
    adHeadline: 'Owe $10,000+ to the IRS? Settle Back Taxes for Pennies',
    adDescription: 'Our tax attorneys stop bank levies, wage garnishments, and negotiate Fresh Start settlements directly with the IRS.',
    adCta: 'Check Settlement Eligibility',
    landingPageUrl: 'https://zenithtaxrelief.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Zenith Tax Services</title></head><body>
      <section class="hero">
        <h1>IRS Tax Resolution & Compliance Services</h1>
        <p>Experienced representation for individual and business taxpayers facing federal tax audits and back tax debt.</p>
        <button>Schedule Free Case Review</button>
      </section>
      <section class="features">
        <p>We evaluate eligibility for Offer in Compromise and installment agreements for clients owing $10,000 or more.</p>
      </section>
      <footer>
        <p>Results vary. Not all taxpayers qualify for IRS tax debt reduction.</p>
      </footer></body></html>`,
    expectedIssue: 'Minor CTA and headline exaggeration: "Pennies on the dollar" is qualified on page as subject to IRS Offer in Compromise criteria.',
    description: 'Typical tax relief compliance qualification.',
  },
  {
    id: 'FIN-20',
    industry: 'Financial Services',
    title: 'Horizon Dental Financing - 0% APR for 24 Months',
    adHeadline: 'Dental Implants Financing: 0% Interest for 24 Months',
    adDescription: 'Don’t delay your dental health. Get low monthly payments with zero down and 0% financing for 24 full months.',
    adCta: 'Apply in 60 Seconds',
    landingPageUrl: 'https://horizondentalfinance.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Horizon Patient Financing</title></head><body>
      <section class="hero">
        <h1>Flexible Healthcare & Dental Financing</h1>
        <p>Spread the cost of dental treatments over affordable monthly installments.</p>
        <button>Find A Provider</button>
      </section>
      <section class="pricing">
        <p>Financing options: Promotional 0% APR available for 6 or 12 month terms only. 24-month terms carry standard 14.99% APR interest.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch & CTA mismatch: Ad promises 0% for 24 months + Apply CTA; page caps 0% at 12 months (24 mo is 14.99%) + Find Provider CTA.',
    description: 'Substantial promotional financing term mismatch.',
  },

  // ==========================================
  // SAAS (Software as a Service) (20 Cases)
  // ==========================================
  {
    id: 'SAAS-01',
    industry: 'SaaS',
    title: 'FlowDesk CRM - $19/mo per User with Free Trial',
    adHeadline: 'Simple Sales CRM for Growing Teams | Only $19/User/Month',
    adDescription: 'Close deals faster with automated email sequences, pipeline tracking, and 2-way Gmail sync. 14-day free trial, no credit card.',
    adCta: 'Start 14-Day Free Trial',
    landingPageUrl: 'https://flowdesk.io/pricing',
    snapshotHtml: `<!DOCTYPE html><html><head><title>FlowDesk CRM Pricing & Plans</title></head><body>
      <header><span class="logo">FlowDesk</span></header>
      <section class="hero">
        <h1>All-in-One Sales CRM for Fast-Moving Teams</h1>
        <p>Track leads, automate outreach, and forecast revenue with our intuitive sales pipeline manager.</p>
        <button class="btn">Start Free 14-Day Trial</button>
      </section>
      <section class="pricing">
        <h2>Subscription Plans</h2>
        <div class="tier">
          <h3>Growth Plan</h3>
          <p class="price">$49 per user / month (billed monthly) or $39 billed annually.</p>
          <p>Includes email sequences, pipeline management, and contact sync.</p>
        </div>
      </section>
      <footer><p>*The $19 starter plan was retired in Q2 2026. All new accounts start on the Growth Plan.</p></footer></body></html>`,
    expectedIssue: 'Offer & price contradiction: Ad advertises $19/mo per user, but landing page explicitly charges $49/mo (retired $19 plan).',
    description: 'Price increase not updated in digital ad creatives.',
  },
  {
    id: 'SAAS-02',
    industry: 'SaaS',
    title: 'CloudVault Backup - 99.999% Uptime Guarantee',
    adHeadline: 'Enterprise Cloud Backup with 99.999% SLA Uptime',
    adDescription: 'Protect critical databases with immutable cloud backups. Continuous replication, ransomware defense, and five-nines uptime SLA.',
    adCta: 'Request Free Trial',
    landingPageUrl: 'https://cloudvault.tech/enterprise',
    snapshotHtml: `<!DOCTYPE html><html><head><title>CloudVault Enterprise Backup</title></head><body>
      <section class="hero">
        <h1>Resilient Enterprise Cloud Backup & Recovery</h1>
        <p>Defend your infrastructure with ransomware-proof immutable storage snapshots and automated disaster recovery failover.</p>
        <button>Schedule Enterprise Demo</button>
      </section>
      <section class="features">
        <h2>Built For High Availability</h2>
        <p>Multi-region geographic replication across AWS and Google Cloud data centers.</p>
      </section>
      <footer>
        <p>Service Level Agreement: Standard commercial tier includes 99.9% availability SLA. Custom SLAs available upon negotiated contract.</p>
      </footer></body></html>`,
    expectedIssue: 'Unsupported claim & CTA mismatch: Ad boasts 99.999% SLA (five nines) + Free Trial CTA; page SLA is 99.9% (three nines) + Schedule Demo CTA.',
    description: 'SLA discrepancy and conversion hurdle mismatch.',
  },
  {
    id: 'SAAS-03',
    industry: 'SaaS',
    title: 'SprintMetrics - Native Jira and GitHub Sync',
    adHeadline: 'Automated Engineering Velocity Metrics for Agile Teams',
    adDescription: 'Track DORA metrics, cycle time, and pull request bottlenecks. Integrates natively with GitHub, GitLab, and Jira in 2 minutes.',
    adCta: 'Connect GitHub Free',
    landingPageUrl: 'https://sprintmetrics.com/integrations',
    snapshotHtml: `<!DOCTYPE html><html><head><title>SprintMetrics Integrations</title></head><body>
      <section class="hero">
        <h1>Engineering Intelligence & DORA Metrics</h1>
        <p>Measure software delivery speed, code review cycle times, and deployment frequency automatically.</p>
        <button>Connect GitHub Free</button>
      </section>
      <section class="features">
        <h2>Supported Git & Issue Trackers</h2>
        <p>One-click authorization with GitHub and GitLab cloud repositories. Real-time webhook ingestion for PRs and issues.</p>
      </section>
      <section class="faq">
        <p>Q: Do you support Atlassian Jira? A: Jira integration is currently in private beta for selected enterprise partners. Public availability expected late 2026.</p>
      </section></body></html>`,
    expectedIssue: 'Missing feature / premature claim: Ad advertises native Jira integration, but page FAQ states Jira is in private beta and not publicly available.',
    description: 'Feature advertised before public release.',
  },
  {
    id: 'SAAS-04',
    industry: 'SaaS',
    title: 'SignQuick - Free Unlimited E-Signatures',
    adHeadline: 'Sign Documents Online for Free | Unlimited E-Signatures',
    adDescription: 'Legally binding e-signatures without the monthly fee. Sign contracts, NDAs, and proposals online without subscription limits.',
    adCta: 'Sign Document Free',
    landingPageUrl: 'https://signquick.io',
    snapshotHtml: `<!DOCTYPE html><html><head><title>SignQuick Free E-Signature</title></head><body>
      <section class="hero">
        <h1>Sign Documents Online for Free with Unlimited E-Signatures</h1>
        <p>Send and sign legally binding contracts, NDAs, and agreements directly from your browser with zero subscription fees.</p>
        <button>Sign Document Free</button>
      </section>
      <section class="features">
        <p>Audit trail certificates, AES-256 encryption, and ESIGN Act compliant.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Hero, headline, unlimited free signatures promise, and CTA are in 100% agreement.',
    description: 'Perfect alignment SaaS case.',
  },
  {
    id: 'SAAS-05',
    industry: 'SaaS',
    title: 'RecruitGenius - AI Resume Screening in 60 Seconds',
    adHeadline: 'Screen 500 Resumes in 60 Seconds with RecruitGenius AI',
    adDescription: 'Rank top applicants automatically, eliminate candidate screening fatigue, and hire 3x faster with generative AI.',
    adCta: 'Try AI Recruiter Free',
    landingPageUrl: 'https://recruitgenius.ai',
    snapshotHtml: `<!DOCTYPE html><html><head><title>RecruitGenius Applicant Tracking</title></head><body>
      <section class="hero">
        <h1>Modern Hiring Platform for Scaling Companies</h1>
        <p>Post jobs across 20+ boards, manage candidate pipelines, and collaborate with interview teams.</p>
        <button>Schedule Product Demo</button>
      </section>
      <section class="features">
        <p>Collaborative candidate scorecards, structured interview kits, and automated calendar scheduling with Google Meet.</p>
      </section></body></html>`,
    expectedIssue: 'Missing promise & missing feature: Ad promotes AI resume screening in 60 seconds, but landing page describes standard ATS job posting with no mention of AI screening.',
    description: 'AI hype ad sending traffic to legacy non-AI feature page.',
  },
  {
    id: 'SAAS-06',
    industry: 'SaaS',
    title: 'LedgerBot - Automated Bookkeeping for Stripe',
    adHeadline: 'Automate Stripe & PayPal Bookkeeping with QuickBooks',
    adDescription: 'Never reconcile transactions manually again. LedgerBot categorizes merchant fees, sales tax, and refunds automatically.',
    adCta: 'Sync Stripe Account',
    landingPageUrl: 'https://ledgerbot.com/stripe-sync',
    snapshotHtml: `<!DOCTYPE html><html><head><title>LedgerBot Stripe to QuickBooks Sync</title></head><body>
      <section class="hero">
        <h1>Automate Stripe & PayPal Bookkeeping with QuickBooks</h1>
        <p>Sync all transactions, fee breakdowns, foreign currency conversions, and refunds directly into your ledger.</p>
        <button>Sync Stripe Account</button>
      </section>
      <section class="features">
        <p>Multi-currency reconciliation, automated sales tax liability tracking, and bank feed verification.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Feature claims, target tools (Stripe, PayPal, QuickBooks), and CTA verified.',
    description: 'Clean SaaS message match.',
  },
  {
    id: 'SAAS-07',
    industry: 'SaaS',
    title: 'DataPipe ETL - Free Tier with 10 Million Rows/Month',
    adHeadline: 'No-Code Cloud ETL Pipeline | 10M Free Rows Every Month',
    adDescription: 'Move data from Postgres to Snowflake in real time. Zero maintenance pipelines with 10 million rows free every month.',
    adCta: 'Start Free ETL',
    landingPageUrl: 'https://datapipe.io/pricing',
    snapshotHtml: `<!DOCTYPE html><html><head><title>DataPipe Cloud Pricing</title></head><body>
      <section class="hero">
        <h1>Cloud Data Integration Without Code</h1>
        <p>Connect your production databases to modern data warehouses with pre-built connectors.</p>
        <button>Start Free ETL</button>
      </section>
      <section class="pricing">
        <h2>Free Developer Tier</h2>
        <p>Free plan includes 1 million synchronized rows per calendar month. Upgrade to Pro ($99/mo) for up to 10 million rows.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch: Ad claims 10 million free rows/month on free tier; page free tier only includes 1 million rows (10M requires $99/mo Pro).',
    description: 'Tenfold row volume exaggeration in ad.',
  },
  {
    id: 'SAAS-08',
    industry: 'SaaS',
    title: 'SecureShield - SOC 2 Type II Certified in 14 Days',
    adHeadline: 'Get SOC 2 Type II Certified in 14 Days Guaranteed',
    adDescription: 'Automate compliance evidence collection across AWS, GCP, and GitHub. Guaranteed SOC 2 readiness in two weeks.',
    adCta: 'Get SOC 2 Fast',
    landingPageUrl: 'https://secureshield.com/soc2',
    snapshotHtml: `<!DOCTYPE html><html><head><title>SecureShield Automated Compliance</title></head><body>
      <section class="hero">
        <h1>Continuous Compliance Automation for Startups</h1>
        <p>Streamline security audits for SOC 2 Type I and Type II with automated cloud controls monitoring.</p>
        <button>Book Compliance Assessment</button>
      </section>
      <section class="body">
        <p>SOC 2 Type I readiness can be achieved in 2 to 4 weeks. Type II compliance requires an observation monitoring window of 3 to 6 months per AICPA guidelines.</p>
      </section></body></html>`,
    expectedIssue: 'Contradiction & impossible claim: Ad guarantees SOC 2 Type II in 14 days; page accurately notes Type II requires a 3 to 6 month observation period.',
    description: 'Regulatory impossibility in ad headline contradicted by page.',
  },
  {
    id: 'SAAS-09',
    industry: 'SaaS',
    title: 'DeskPulse - Live Chat Widget with 24/7 Human Agents',
    adHeadline: 'Live Chat for Your Website with 24/7 Included Human Agents',
    adDescription: 'Convert visitors into customers around the clock. We provide trained chat agents to answer inquiries for $99/month flat.',
    adCta: 'Add Live Chat',
    landingPageUrl: 'https://deskpulse.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>DeskPulse Customer Chat Software</title></head><body>
      <section class="hero">
        <h1>Modern Customer Messaging Software</h1>
        <p>Equip your internal support team with shared inboxes, omnichannel chat widgets, and proactive trigger messages.</p>
        <button>Start Free Trial</button>
      </section>
      <section class="features">
        <p>Self-hosted software tool. You invite your own team members to staff the chat console.</p>
      </section></body></html>`,
    expectedIssue: 'Missing feature & offer contradiction: Ad advertises included human staff for $99/mo; product is solely software for internal staff.',
    description: 'SaaS software sold as a managed staffing service in ad.',
  },
  {
    id: 'SAAS-10',
    industry: 'SaaS',
    title: 'DocuForge - Convert PDF to Word with 100% Formatting Retained',
    adHeadline: 'Convert Any PDF to Editable Word Docs | 100% Free Tool',
    adDescription: 'Keep fonts, tables, and formatting intact. Convert scanned PDFs to Microsoft Word docx in seconds without watermarks.',
    adCta: 'Convert PDF Free',
    landingPageUrl: 'https://docuforge.com/pdf-to-word',
    snapshotHtml: `<!DOCTYPE html><html><head><title>DocuForge PDF to Word Converter</title></head><body>
      <section class="hero">
        <h1>Convert PDF to Word Online</h1>
        <p>Easily transform PDF documents into editable DOCX files in your browser with high fidelity formatting preservation.</p>
        <button>Upload PDF</button>
      </section>
      <section class="features">
        <p>No watermarks added to converted documents. Fast, secure server-side OCR processing.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Core utility, free formatting retention, zero watermark claim supported.',
    description: 'Well matched utility SaaS landing page.',
  },
  {
    id: 'SAAS-11',
    industry: 'SaaS',
    title: 'WorkCanvas - Unlimited Project Boards Free Forever',
    adHeadline: 'Visual Project Management | Unlimited Boards Free Forever',
    adDescription: 'Ditch confusing spreadsheets. Collaborate with your team using Kanban boards, Gantt charts, and checklists at zero cost.',
    adCta: 'Create Free Account',
    landingPageUrl: 'https://workcanvas.com/pricing',
    snapshotHtml: `<!DOCTYPE html><html><head><title>WorkCanvas Plans & Pricing</title></head><body>
      <section class="hero">
        <h1>Collaborative Work Management for Teams</h1>
        <p>Plan sprints, track task assignments, and visualize project timelines effortlessly.</p>
        <button>Get Started Free</button>
      </section>
      <section class="pricing">
        <p>Free Tier: Up to 3 active project boards and 5 team members. Upgrade to Business ($12/user) for unlimited boards and Gantt charts.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch: Ad promises "Unlimited boards free forever", but landing page pricing limits free tier to 3 boards.',
    description: 'Free tier limits disguised as unlimited.',
  },
  {
    id: 'SAAS-12',
    industry: 'SaaS',
    title: 'VideoTranscribe - 99% Accurate Multilingual Subtitles',
    adHeadline: 'AI Video Subtitles in 120+ Languages with 99% Accuracy',
    adDescription: 'Auto-generate animated captions for TikTok, YouTube Shorts, and Reels. Export hardcoded MP4 or SRT in one click.',
    adCta: 'Generate Subtitles Free',
    landingPageUrl: 'https://videotranscribe.io',
    snapshotHtml: `<!DOCTYPE html><html><head><title>VideoTranscribe AI Captions</title></head><body>
      <section class="hero">
        <h1>AI Video Subtitles in 120+ Languages</h1>
        <p>Generate highly accurate animated captions for Reels, Shorts, and TikTok with customizable styling.</p>
        <button>Generate Subtitles Free</button>
      </section>
      <section class="features">
        <p>Export in SRT, VTT, or render directly into high-definition MP4 videos.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Multilingual capabilities, short-form video focus, and export options substantiated.',
    description: 'High match creator SaaS.',
  },
  {
    id: 'SAAS-13',
    industry: 'SaaS',
    title: 'HostRocket - Unmetered NVMe WordPress Hosting for $2.95/mo',
    adHeadline: 'High-Speed WordPress Hosting: $2.95/Month with Free Domain',
    adDescription: 'Blazing fast NVMe SSD storage, free SSL certificates, automated daily backups, and free custom domain registration.',
    adCta: 'Get Hosting for $2.95',
    landingPageUrl: 'https://hostrocket.net/wordpress',
    snapshotHtml: `<!DOCTYPE html><html><head><title>HostRocket Managed WordPress</title></head><body>
      <section class="hero">
        <h1>Blazing Fast Managed WordPress Hosting</h1>
        <p>Supercharge your website loading speeds with cloud NVMe infrastructure and free Cloudflare CDN integration.</p>
        <button>View Plans</button>
      </section>
      <section class="pricing">
        <p>Special Introductory Rate: $2.95/month when pre-paying for a 36-month contract ($106.20 due today). Renews at regular rate of $9.99/month.</p>
        <p>Free domain requires 1-year minimum commitment.</p>
      </section></body></html>`,
    expectedIssue: 'Missing context / positioning mismatch: $2.95/mo requires a 36-month upfront prepayment ($106.20) and renews at $9.99/mo.',
    description: 'Omission of long-term lock-in requirement in ad.',
  },
  {
    id: 'SAAS-14',
    industry: 'SaaS',
    title: 'MailBlast - 99.8% Email Inbox Deliverability',
    adHeadline: 'Email Marketing Platform with Guaranteed 99.8% Inbox Rates',
    adDescription: 'Stop landing in the spam folder. Dedicated IP warm-up, AI subject line optimizer, and drag-and-drop newsletter builder.',
    adCta: 'Try MailBlast Free',
    landingPageUrl: 'https://mailblast.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>MailBlast Newsletter Software</title></head><body>
      <section class="hero">
        <h1>Beautiful Email Campaigns That Reach Audiences</h1>
        <p>Design modern newsletters with our drag-and-drop template editor and segment subscribers based on engagement.</p>
        <button>Try MailBlast Free</button>
      </section>
      <section class="features">
        <p>Deliverability tools: Automated DKIM, SPF, and DMARC wizard setup assistance.</p>
      </section>
      <footer>
        <p>Disclaimer: Email delivery rates depend heavily on sender reputation, list hygiene, and recipient server policies. Specific inbox rates are not guaranteed.</p>
      </footer></body></html>`,
    expectedIssue: 'Unsupported guarantee: Ad claims guaranteed 99.8% inbox rate; footer disclaims that specific inbox rates cannot be guaranteed.',
    description: 'Technical impossibility guaranteed in ad copy.',
  },
  {
    id: 'SAAS-15',
    industry: 'SaaS',
    title: 'QueryLens - Real-Time PostgreSQL Query Performance Monitoring',
    adHeadline: 'Pinpoint Slow PostgreSQL Queries with Zero Agent Overhead',
    adDescription: 'Detect N+1 queries, missing indexes, and connection pool exhaustion in real time. Works with AWS RDS, Supabase, and Heroku.',
    adCta: 'Start Free 30-Day Trial',
    landingPageUrl: 'https://querylens.dev',
    snapshotHtml: `<!DOCTYPE html><html><head><title>QueryLens Database Observability</title></head><body>
      <section class="hero">
        <h1>Pinpoint Slow PostgreSQL Queries with Zero Overhead</h1>
        <p>Identify slow transactions, missing indexes, and CPU spikes in your Postgres databases across AWS RDS and Supabase.</p>
        <button>Start Free 30-Day Trial</button>
      </section>
      <section class="features">
        <p>Non-intrusive metadata sampling using pg_stat_statements with under 0.5% CPU footprint.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Technical claims, database support, zero overhead, and trial terms aligned.',
    description: 'Developer SaaS benchmark test.',
  },
  {
    id: 'SAAS-16',
    industry: 'SaaS',
    title: 'StaffClock - GPS Employee Time Tracking with Geofencing',
    adHeadline: 'Mobile Employee Time Clock with Geofenced Job Sites',
    adDescription: 'Track mobile crew hours with precision GPS timestamps. Prevent buddy punching and export payroll directly to Gusto.',
    adCta: 'Start 14-Day Free Trial',
    landingPageUrl: 'https://staffclock.app',
    snapshotHtml: `<!DOCTYPE html><html><head><title>StaffClock Mobile Timesheets</title></head><body>
      <section class="hero">
        <h1>Mobile Employee Time Clock with Geofenced Job Sites</h1>
        <p>Ensure field workers clock in only when on site with GPS geofencing, facial recognition verification, and direct payroll export to Gusto.</p>
        <button>Start 14-Day Free Trial</button>
      </section></body></html>`,
    expectedIssue: 'Supported match: Exact alignment on geofencing, Gusto export, and trial CTA.',
    description: 'Field service SaaS ad match.',
  },
  {
    id: 'SAAS-17',
    industry: 'SaaS',
    title: 'HyperSEO - Automated Backlink Outreach on Autopilot',
    adHeadline: 'Build 50 High-Authority Backlinks Every Month Automatically',
    adDescription: 'Automate PR pitching, broken link building, and influencer outreach. Ranked #1 SEO software for B2B tech founders.',
    adCta: 'Get 50 Backlinks',
    landingPageUrl: 'https://hyperseo.tools',
    snapshotHtml: `<!DOCTYPE html><html><head><title>HyperSEO Keyword Research Tool</title></head><body>
      <section class="hero">
        <h1>Rank Higher with Keyword & SERP Analysis</h1>
        <p>Research competitor search rankings, find low-competition keywords, and monitor search position changes over time.</p>
        <button>Start 7-Day Trial</button>
      </section>
      <section class="features">
        <p>Keyword difficulty metrics, search volume trends, and on-page content optimization auditor.</p>
      </section></body></html>`,
    expectedIssue: 'Severe mismatch: Ad sells automated backlink building; landing page is purely a keyword research and SERP analysis tool.',
    description: 'Complete product utility misalignment.',
  },
  {
    id: 'SAAS-18',
    industry: 'SaaS',
    title: 'PodHost - Unlimited Podcast Audio Hosting for $5/mo',
    adHeadline: 'Unlimited Podcast Hosting & RSS Distribution for $5/mo',
    adDescription: 'Distribute your podcast to Apple Podcasts, Spotify, and YouTube Music. Unlimited storage, bandwidth, and IAB certified analytics.',
    adCta: 'Launch Podcast for $5',
    landingPageUrl: 'https://podhost.fm/pricing',
    snapshotHtml: `<!DOCTYPE html><html><head><title>PodHost Pricing</title></head><body>
      <section class="hero">
        <h1>Podcast Hosting Made Simple</h1>
        <p>Publish episodes to Spotify and Apple Podcasts with one-click RSS feeds.</p>
        <button>Launch Podcast</button>
      </section>
      <section class="pricing">
        <p>Starter Plan: $5/month (Includes up to 3 hours of audio uploads per month). Unlimited Plan is $20/month.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch: Ad advertises "Unlimited podcast hosting for $5/mo", but $5 plan is capped at 3 hours/month (unlimited is $20/mo).',
    description: 'Upload cap omitted from headline offer.',
  },
  {
    id: 'SAAS-19',
    industry: 'SaaS',
    title: 'FormBuilder Pro - HIPAA Compliant Online Forms',
    adHeadline: 'HIPAA Compliant Patient Intake Forms | Signed BAA Included',
    adDescription: 'Collect medical histories, insurance cards, and electronic consent securely. Includes signed Business Associate Agreement on all plans.',
    adCta: 'Create HIPAA Form',
    landingPageUrl: 'https://formbuilderpro.com/healthcare',
    snapshotHtml: `<!DOCTYPE html><html><head><title>FormBuilder Pro for Healthcare</title></head><body>
      <section class="hero">
        <h1>HIPAA Compliant Patient Intake Forms</h1>
        <p>Securely collect patient questionnaires, insurance card photos, and digital signatures with end-to-end encryption.</p>
        <button>Create HIPAA Form</button>
      </section>
      <section class="features">
        <p>Signed Business Associate Agreement (BAA) provided upon account setup for covered entities.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: BAA inclusion, HIPAA compliance, and intake form focus verified.',
    description: 'Healthcare compliance SaaS match.',
  },
  {
    id: 'SAAS-20',
    industry: 'SaaS',
    title: 'StatusBeacon - Multi-Cloud Uptime Monitoring',
    adHeadline: 'Public Status Pages & Ping Monitoring from 20 Global Locations',
    adDescription: 'Notify customers instantly during downtime. 30-second check intervals, SMS incident alerts, and custom branded status domains.',
    adCta: 'Create Free Status Page',
    landingPageUrl: 'https://statusbeacon.io',
    snapshotHtml: `<!DOCTYPE html><html><head><title>StatusBeacon Status Pages</title></head><body>
      <section class="hero">
        <h1>Public Status Pages & Uptime Monitoring</h1>
        <p>Keep your users informed during service outages with automated status pages and multi-region probe monitoring.</p>
        <button>Create Free Status Page</button>
      </section>
      <section class="features">
        <p>30-second ping checks across 20 global observation nodes. SMS, Slack, and Webhook alert integrations.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Global location count, ping interval, and CTA substantiated.',
    description: 'Infrastructure SaaS perfect alignment.',
  },

  // ==========================================
  // CONSUMER E-COMMERCE (20 Cases)
  // ==========================================
  {
    id: 'ECOM-01',
    industry: 'E-Commerce',
    title: 'RestCloud Mattress - 100-Night Trial & 40% Off',
    adHeadline: 'Memorial Day Sale: 40% Off RestCloud Hybrid Mattress',
    adDescription: 'Sleep cooler with adaptive memory foam and pocketed coils. Risk-free 100-night home sleep trial with free delivery and returns.',
    adCta: 'Shop 40% Off Sale',
    landingPageUrl: 'https://restcloudsleep.com/hybrid',
    snapshotHtml: `<!DOCTYPE html><html><head><title>RestCloud Hybrid Mattress</title></head><body>
      <section class="hero">
        <h1>RestCloud Luxury Hybrid Mattress</h1>
        <p>Engineered for optimal spinal alignment with cooling gel memory foam and individually encased coil support.</p>
        <button>Shop Mattress</button>
      </section>
      <section class="pricing">
        <p>Price: $1,299 (Regular price $1,499 - Save 13%).</p>
      </section>
      <section class="features">
        <p>Sleep trial: Includes a 30-day return policy. Returned items subject to a $99 pickup fee.</p>
      </section></body></html>`,
    expectedIssue: 'Severe offer mismatch: Ad promises 40% off and 100-night trial with free returns; page offers only 13% off, 30-day trial, and charges a $99 return fee.',
    description: 'Discount and return policy contradictions.',
  },
  {
    id: 'ECOM-02',
    industry: 'E-Commerce',
    title: 'PureStride Sneakers - 100% Recycled Waterproof Running Shoes',
    adHeadline: '100% Waterproof Running Shoes Made from Recycled Ocean Plastic',
    adDescription: 'Stay dry on rainy trail runs. Ultra-cushioned midsole, zero-slip rubber grip, and breathable waterproof membrane.',
    adCta: 'Shop Waterproof Shoes',
    landingPageUrl: 'https://purestride.com/shoes',
    snapshotHtml: `<!DOCTYPE html><html><head><title>PureStride Lightweight Running Shoes</title></head><body>
      <section class="hero">
        <h1>PureStride Everyday Running Shoes</h1>
        <p>Ultra-breathable lightweight sneakers designed for summer road running and daily gym workouts.</p>
        <button>Shop Now</button>
      </section>
      <section class="features">
        <p>Crafted with recycled mesh upper for maximum airflow. Note: Not water resistant; dry conditions recommended.</p>
      </section></body></html>`,
    expectedIssue: 'Direct contradiction: Ad promises 100% waterproof shoes; landing page explicitly notes "Not water resistant; dry conditions recommended".',
    description: 'Critical product feature contradiction.',
  },
  {
    id: 'ECOM-03',
    industry: 'E-Commerce',
    title: 'Lumina Smart Lamp - Sunrise Alarm with App Control',
    adHeadline: 'Wake Up Refreshed: Sunrise Alarm Clock with Nature Sounds',
    adDescription: 'Gradual light simulation eases morning wakeups naturally. 20 brightness settings, FM radio, and custom app scheduling.',
    adCta: 'Get 25% Off Lumina',
    landingPageUrl: 'https://luminasleep.com/lamp',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Lumina Sunrise Alarm Clock</title></head><body>
      <section class="hero">
        <h1>Wake Up Refreshed: Sunrise Alarm Clock</h1>
        <p>Simulates natural morning sunlight over 30 minutes to boost energy and regulate your circadian rhythm.</p>
        <button>Get 25% Off Lumina</button>
      </section>
      <section class="features">
        <p>Features 20 light intensity levels, 7 soothing nature sound presets, and dual smart alarms.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Sunrise simulation, features, and discount CTA verified.',
    description: 'Well-aligned consumer hardware product page.',
  },
  {
    id: 'ECOM-04',
    industry: 'E-Commerce',
    title: 'Apex Chef Knives - Japanese Damascus Steel 3-Piece Set for $89',
    adHeadline: 'Authentic 67-Layer Damascus Chef Knife Set Only $89',
    adDescription: 'Razor-sharp Japanese VG-10 steel. Includes 8" chef knife, 6" utility knife, and 3.5" paring knife in wooden gift box.',
    adCta: 'Order Knife Set for $89',
    landingPageUrl: 'https://apexcutlery.com/damascus',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Apex Cutlery Collections</title></head><body>
      <section class="hero">
        <h1>Handcrafted Kitchen Cutlery</h1>
        <p>Elevate your home culinary experience with premium precision stainless steel kitchen knives.</p>
        <button>Explore Collection</button>
      </section>
      <section class="pricing">
        <p>German Stainless Steel 3-Piece Set: $89. Authentic 67-Layer Japanese VG-10 Damascus 3-Piece Set: $249.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch / bait-and-switch: Ad prices Japanese Damascus set at $89, but page shows Damascus set is $249 ($89 is German stainless steel).',
    description: 'Material and pricing confusion.',
  },
  {
    id: 'ECOM-05',
    industry: 'E-Commerce',
    title: 'Verve Coffee Subscription - First Bag Free with Free Shipping',
    adHeadline: 'Get Your First Bag of Artisan Coffee Free | Free Shipping',
    adDescription: 'Freshly roasted single-origin whole bean coffee delivered to your door. Customize roast level and delivery frequency.',
    adCta: 'Claim Free Coffee Bag',
    landingPageUrl: 'https://vervecoffeeroasters.com/club',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Artisan Coffee Subscription Club</title></head><body>
      <section class="hero">
        <h1>Freshly Roasted Single-Origin Coffee Delivered Weekly</h1>
        <p>Experience the finest coffee beans roasted to order and delivered at peak freshness.</p>
        <button>Choose Your Plan</button>
      </section>
      <section class="pricing">
        <p>First order receives 50% discount ($11 + $4.95 shipping). Standard subscription $22/bag thereafter.</p>
      </section></body></html>`,
    expectedIssue: 'Offer contradiction: Ad promises "First bag free with free shipping", but page charges $11 plus $4.95 shipping for first order.',
    description: 'Free trial vs paid starter kit contradiction.',
  },
  {
    id: 'ECOM-06',
    industry: 'E-Commerce',
    title: 'GlowSkin Serum - 15% Vitamin C with Hyaluronic Acid',
    adHeadline: 'Fade Dark Spots Fast: 15% Pure Vitamin C Brightening Serum',
    adDescription: 'Dermatologist tested anti-aging serum with ferulic acid and hyaluronic acid. Clinically proven results in 14 days.',
    adCta: 'Shop Vitamin C Serum',
    landingPageUrl: 'https://glowskinlab.com/c-serum',
    snapshotHtml: `<!DOCTYPE html><html><head><title>GlowSkin 15% Vitamin C Serum</title></head><body>
      <section class="hero">
        <h1>Fade Dark Spots: 15% Pure Vitamin C Brightening Serum</h1>
        <p>Formulated with stable L-ascorbic acid, ferulic acid, and hyaluronic acid to visibly illuminate skin tone.</p>
        <button>Shop Vitamin C Serum</button>
      </section>
      <section class="features">
        <p>Consumer testing: 92% of participants noticed visibly brighter skin in 14 days of twice-daily application.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Ingredients, concentration, clinical timeline, and CTA fully verified.',
    description: 'Clean e-commerce skincare match.',
  },
  {
    id: 'ECOM-07',
    industry: 'E-Commerce',
    title: 'SoundWave ANC Headphones - 60-Hour Battery Life',
    adHeadline: 'Active Noise Cancelling Wireless Headphones | 60H Battery',
    adDescription: 'Block outside noise with hybrid active noise cancellation. Ultra-comfortable memory foam earcups and 60-hour playtime.',
    adCta: 'Buy Headphones for $79',
    landingPageUrl: 'https://soundwaveaudio.com/anc-pro',
    snapshotHtml: `<!DOCTYPE html><html><head><title>SoundWave ANC Pro Headphones</title></head><body>
      <section class="hero">
        <h1>SoundWave Pro Hybrid Noise Cancelling Headphones</h1>
        <p>Immerse yourself in rich, high-resolution audio with custom 40mm dynamic acoustic drivers.</p>
        <button>Add to Cart - $129</button>
      </section>
      <section class="features">
        <p>Battery performance: Up to 35 hours of playback with ANC enabled (45 hours without ANC). Fast USB-C charging.</p>
      </section></body></html>`,
    expectedIssue: 'Dual mismatch: Ad promises 60-hour battery life and $79 price; page states 35-hour ANC battery and $129 price.',
    description: 'Specification and pricing mismatches.',
  },
  {
    id: 'ECOM-08',
    industry: 'E-Commerce',
    title: 'ErgoDesk Pro - Electric Standing Desk with Dual Motors',
    adHeadline: 'Solid Bamboo Electric Standing Desk | Supports Up to 350 lbs',
    adDescription: 'Upgrade your home office with whisper-quiet dual motors, 4 memory presets, and anti-collision technology. 10-year warranty.',
    adCta: 'Customize Your Desk',
    landingPageUrl: 'https://ergodesk.com/pro',
    snapshotHtml: `<!DOCTYPE html><html><head><title>ErgoDesk Pro Standing Desk</title></head><body>
      <section class="hero">
        <h1>Solid Bamboo Electric Standing Desk</h1>
        <p>Premium dual motor lifting system supports up to 350 lbs with 4 programmable height presets.</p>
        <button>Customize Your Desk</button>
      </section>
      <section class="features">
        <p>Backed by a comprehensive 10-year structural frame and motor warranty. Free curb-side shipping included.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Weight capacity, motors, material, presets, warranty, and CTA substantiated.',
    description: 'Office furniture benchmark test.',
  },
  {
    id: 'ECOM-09',
    industry: 'E-Commerce',
    title: 'TrailBlazer Backpack - Lifetime Guarantee & TSA Approved',
    adHeadline: 'Carry-On Travel Backpack with Built-In USB Charger & Lifetime Warranty',
    adDescription: 'Pack for 5 days in one TSA compliant bag. Waterproof Cordura fabric, padded 17" laptop compartment, and lifetime guarantee.',
    adCta: 'Shop Travel Backpack',
    landingPageUrl: 'https://trailblazergear.com/travel-pack',
    snapshotHtml: `<!DOCTYPE html><html><head><title>TrailBlazer 35L Travel Pack</title></head><body>
      <section class="hero">
        <h1>The Ultimate 35L Carry-On Travel Backpack</h1>
        <p>Designed for weekend getaways and one-bag international travel with quick-access laptop sleeve.</p>
        <button>Shop Travel Backpack</button>
      </section>
      <section class="features">
        <p>Built with water-resistant 500D nylon. Fits laptops up to 15.6 inches.</p>
      </section>
      <footer>
        <p>Warranty: 2-year limited manufacturer warranty covering zippers and seam defects.</p>
      </footer></body></html>`,
    expectedIssue: 'Feature & warranty contradiction: Ad promises 17" laptop sleeve and lifetime warranty; page fits max 15.6" laptop and has 2-year warranty in footer.',
    description: 'Warranty and dimension discrepancies.',
  },
  {
    id: 'ECOM-10',
    industry: 'E-Commerce',
    title: 'ZenBreeze Air Purifier - True HEPA for 1,500 Sq Ft',
    adHeadline: 'Hospital-Grade HEPA Air Purifier for Large Rooms Up to 1,500 Sq Ft',
    adDescription: 'Captures 99.97% of dust, pet dander, pollen, and smoke. Whisper quiet sleep mode with real-time PM2.5 air quality sensor.',
    adCta: 'Buy Air Purifier',
    landingPageUrl: 'https://zenbreeze.com/clean-air',
    snapshotHtml: `<!DOCTYPE html><html><head><title>ZenBreeze Home Air Purifier</title></head><body>
      <section class="hero">
        <h1>Breathe Pure Air with ZenBreeze True HEPA</h1>
        <p>Eliminate allergens and odor with multi-stage filtration. Cleans rooms up to 500 square feet every 30 minutes.</p>
        <button>Buy Air Purifier</button>
      </section>
      <section class="features">
        <p>True HEPA H13 filtration removes 99.97% of airborne particles down to 0.3 microns.</p>
      </section></body></html>`,
    expectedIssue: 'Performance claim mismatch: Ad promises room coverage up to 1,500 sq ft, but landing page rates unit for only 500 sq ft.',
    description: 'Coverage area claim exaggerated by 300%.',
  },
  {
    id: 'ECOM-11',
    industry: 'E-Commerce',
    title: 'AeroDrone 4K - GPS Drone with 45-Minute Flight Time',
    adHeadline: 'Foldable 4K HDR Camera Drone with 45-Minute Flight Time',
    adDescription: 'Capture cinematic aerial footage with 3-axis gimbal stabilization, obstacle avoidance sensors, and 5km transmission range.',
    adCta: 'Order AeroDrone for $199',
    landingPageUrl: 'https://aerodrone.tech/mini',
    snapshotHtml: `<!DOCTYPE html><html><head><title>AeroDrone Mini 4K</title></head><body>
      <section class="hero">
        <h1>Foldable 4K HDR Camera Drone</h1>
        <p>Experience steady flight and clear aerial photography with motorized camera tilt.</p>
        <button>Order Now - $299</button>
      </section>
      <section class="features">
        <p>Battery specifications: Up to 22 minutes flight time per battery charge. Dual battery bundle includes 44 minutes combined flight time.</p>
      </section></body></html>`,
    expectedIssue: 'Claim & price mismatch: Ad says 45-minute flight time and $199; page specifies 22 minutes per battery and price is $299.',
    description: 'Flight endurance and price mismatch.',
  },
  {
    id: 'ECOM-12',
    industry: 'E-Commerce',
    title: 'FitTrack Scale - 17 Body Composition Metrics',
    adHeadline: 'Smart Body Fat Scale: 17 Health Metrics Synced to Apple Health',
    adDescription: 'Track muscle mass, visceral fat, hydration, and BMI with high precision BIA sensors. Unlimited family profiles on free mobile app.',
    adCta: 'Shop Smart Scale',
    landingPageUrl: 'https://fittrackscale.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>FitTrack Smart Scale</title></head><body>
      <section class="hero">
        <h1>Smart Body Fat Scale with 17 Health Metrics</h1>
        <p>Measure body composition including BMI, muscle mass, body water, and visceral fat with dual-frequency sensors.</p>
        <button>Shop Smart Scale</button>
      </section>
      <section class="features">
        <p>Seamlessly syncs historical weight trends with Apple Health, Fitbit, and Google Fit.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Metric count, sync ecosystem, and CTA supported.',
    description: 'Clean consumer tech alignment.',
  },
  {
    id: 'ECOM-13',
    industry: 'E-Commerce',
    title: 'KetoBites Snack Bars - Zero Net Carbs & 15g Protein',
    adHeadline: 'Guilt-Free Keto Chocolate Bars | 0g Net Carbs & 15g Protein',
    adDescription: 'Satisfy sweet cravings without the insulin spike. Made with almond butter and monk fruit sweetener. 100% money back guarantee.',
    adCta: 'Order Variety Pack',
    landingPageUrl: 'https://ketobites.co/bars',
    snapshotHtml: `<!DOCTYPE html><html><head><title>KetoBites Protein Bars</title></head><body>
      <section class="hero">
        <h1>Delicious Low Carb Protein Snack Bars</h1>
        <p>Crafted for ketogenic diets with rich dark chocolate, whey protein isolate, and prebiotic fiber.</p>
        <button>Order Variety Pack</button>
      </section>
      <section class="features">
        <p>Nutritional facts: 12g protein per bar, 4g net carbohydrates (18g total carbs minus 14g dietary fiber).</p>
      </section></body></html>`,
    expectedIssue: 'Nutritional claim mismatch: Ad promises 0g net carbs and 15g protein; nutrition panel shows 4g net carbs and 12g protein.',
    description: 'Keto macro claim discrepancy.',
  },
  {
    id: 'ECOM-14',
    industry: 'E-Commerce',
    title: 'Nomad Solar Power Bank - 25,000mAh Rugged Charger',
    adHeadline: 'Waterproof 25,000mAh Solar Power Bank with Wireless Charging',
    adDescription: 'Charge your phone 6 times off grid. Built-in LED camping flashlight, rugged shockproof rubber casing, and IP67 waterproof rating.',
    adCta: 'Buy Solar Charger',
    landingPageUrl: 'https://nomadbattery.com/solar',
    snapshotHtml: `<!DOCTYPE html><html><head><title>Nomad 25,000mAh Solar Bank</title></head><body>
      <section class="hero">
        <h1>Waterproof 25,000mAh Solar Power Bank</h1>
        <p>High capacity outdoor portable power with integrated solar emergency panel and wireless charging pad.</p>
        <button>Buy Solar Charger</button>
      </section>
      <section class="features">
        <p>IP67 submersible waterproof rating, dual USB-C PD 20W fast charging, and 3-mode LED flashlight.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Battery capacity, wireless charging, IP67 waterproof rating, and CTA substantiated.',
    description: 'Outdoor gear benchmark match.',
  },
  {
    id: 'ECOM-15',
    industry: 'E-Commerce',
    title: 'EcoClean Detergent Sheets - 100 Loads for $12',
    adHeadline: 'Plastic-Free Laundry Detergent Sheets | 100 Loads for Just $12',
    adDescription: 'Eliminate heavy plastic jugs. Dissolves completely in hot or cold water with plant-based enzymes. Free carbon-neutral shipping.',
    adCta: 'Try Detergent Sheets',
    landingPageUrl: 'https://ecocleanlaundry.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>EcoClean Laundry Sheets</title></head><body>
      <section class="hero">
        <h1>Zero Waste Laundry Detergent Sheets</h1>
        <p>Powerful plant-derived cleaning sheets that dissolve instantly in all washing machines.</p>
        <button>Try Detergent Sheets</button>
      </section>
      <section class="pricing">
        <p>Standard pack: 50 loads for $15 ($0.30/load). Double pack: 100 loads for $24.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch: Ad promises 100 loads for $12; landing page pricing lists 100 loads for $24 ($12 is half the published price).',
    description: 'Unit pricing contradiction.',
  },
  {
    id: 'ECOM-16',
    industry: 'E-Commerce',
    title: 'VelvetSheet Egyptian Cotton - 1,000 Thread Count Luxury Set',
    adHeadline: '1,000 Thread Count 100% Egyptian Cotton Luxury Bed Sheets',
    adDescription: 'Silky sateen weave, deep pocket fitted sheet, and breathable long-staple cotton fibers. Ships free with 60-night sleep trial.',
    adCta: 'Shop Luxury Sheets',
    landingPageUrl: 'https://velvetsheets.com/bedding',
    snapshotHtml: `<!DOCTYPE html><html><head><title>VelvetSheet Luxury Bedding</title></head><body>
      <section class="hero">
        <h1>1,000 Thread Count 100% Egyptian Cotton Bed Sheets</h1>
        <p>Experience five-star hotel comfort with ultra-soft sateen woven long-staple cotton fibers.</p>
        <button>Shop Luxury Sheets</button>
      </section>
      <section class="features">
        <p>Deep pocket design accommodates mattresses up to 18 inches. Includes a 60-night satisfaction guarantee.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Thread count, material, trial window, and CTA verified.',
    description: 'Bedding e-commerce match.',
  },
  {
    id: 'ECOM-17',
    industry: 'E-Commerce',
    title: 'HydraFlow Insulated Bottle - Keeps Drinks Cold for 48 Hours',
    adHeadline: 'Double-Wall Vacuum Insulated Water Bottle | Cold for 48 Hours',
    adDescription: 'Stay hydrated with premium 18/8 food-grade stainless steel. Leak-proof straw lid, cup holder compatible, and dishwasher safe.',
    adCta: 'Order HydraFlow Bottle',
    landingPageUrl: 'https://hydraflowgear.com/bottle',
    snapshotHtml: `<!DOCTYPE html><html><head><title>HydraFlow Insulated Tumbler</title></head><body>
      <section class="hero">
        <h1>HydraFlow Stainless Steel Water Bottle</h1>
        <p>Keep your hydration icy cold with double-wall copper vacuum insulation.</p>
        <button>Order HydraFlow Bottle</button>
      </section>
      <section class="features">
        <p>Thermal testing: Keeps ice frozen and beverages cold for up to 24 hours (hot beverages stay warm for 12 hours).</p>
      </section></body></html>`,
    expectedIssue: 'Performance claim mismatch: Ad promises 48 hours cold; page thermal rating specifies up to 24 hours cold.',
    description: 'Thermal insulation claim doubled in ad.',
  },
  {
    id: 'ECOM-18',
    industry: 'E-Commerce',
    title: 'TimberCraft Wood Sunglasses - Polarized Bamboo with Floating Frame',
    adHeadline: 'Polarized Bamboo Sunglasses That Float in Water | $39 Pair',
    adDescription: 'Never lose your sunglasses in the lake again. Lightweight sustainable bamboo frames with 100% UV400 polarized TAC lenses.',
    adCta: 'Buy Bamboo Sunglasses',
    landingPageUrl: 'https://timbercraftshades.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>TimberCraft Floating Shades</title></head><body>
      <section class="hero">
        <h1>Polarized Bamboo Sunglasses That Float in Water</h1>
        <p>Handcrafted lightweight bamboo frames designed for boating, surfing, and outdoor water sports.</p>
        <button>Buy Bamboo Sunglasses</button>
      </section>
      <section class="pricing">
        <p>Price: $39. Includes micro-fiber cleaning pouch and bamboo cylinder case.</p>
      </section>
      <section class="features">
        <p>UV400 polarized composite lenses eliminate harsh glare from open water.</p>
      </section></body></html>`,
    expectedIssue: 'Supported match: Floating feature, price ($39), polarized UV400, and CTA fully supported.',
    description: 'Eyewear benchmark test.',
  },
  {
    id: 'ECOM-19',
    industry: 'E-Commerce',
    title: 'PurrfectFeeder - Automatic Pet Feeder with 1080p HD Camera',
    adHeadline: 'Smart Pet Feeder with HD Video & Two-Way Audio Dispenser',
    adDescription: 'Feed your cat or dog from your smartphone anywhere. Schedule portion sizes, watch live video feed, and record personalized voice calls.',
    adCta: 'Get Smart Feeder',
    landingPageUrl: 'https://purrfectfeeder.com',
    snapshotHtml: `<!DOCTYPE html><html><head><title>PurrfectFeeder Automatic Feeder</title></head><body>
      <section class="hero">
        <h1>Programmable Automatic Pet Feeder</h1>
        <p>Automate feeding schedules with digital timer and customizable portion control for dry kibble.</p>
        <button>Get Smart Feeder</button>
      </section>
      <section class="features">
        <p>Mechanical LCD timer controls up to 4 meals per day. Battery backup prevents missed meals.</p>
      </section>
      <section class="faq">
        <p>Q: Does this model include a camera or WiFi? A: No, this is an offline timer model. Our WiFi Camera model is sold separately as the Pro Edition ($149).</p>
      </section></body></html>`,
    expectedIssue: 'Missing features & contradiction: Ad advertises HD camera and smartphone app; landing page is an offline LCD timer and states camera model is separate.',
    description: 'Feature-heavy ad driving to basic offline model.',
  },
  {
    id: 'ECOM-20',
    industry: 'E-Commerce',
    title: 'GlowTooth Sonic Whitening - 40,000 VPM Electric Toothbrush',
    adHeadline: 'Sonic Electric Toothbrush with 8 Free Replacement Brush Heads',
    adDescription: 'Whiten teeth in 7 days with 40,000 vibrations per minute. Includes travel case and 2 years worth of free replacement brush heads for $29.',
    adCta: 'Order Whitening Toothbrush',
    landingPageUrl: 'https://glowtoothcare.com/sonic',
    snapshotHtml: `<!DOCTYPE html><html><head><title>GlowTooth Sonic Electric Toothbrush</title></head><body>
      <section class="hero">
        <h1>Sonic Whitening Electric Toothbrush</h1>
        <p>Deliver 40,000 sonic vibrations per minute for a dentist-clean feel and plaque reduction.</p>
        <button>Order Whitening Toothbrush</button>
      </section>
      <section class="pricing">
        <p>Toothbrush Starter Kit: $29 (Includes handle, charging base, and 2 brush heads). 8-head replenishment pack sold separately for $18.</p>
      </section></body></html>`,
    expectedIssue: 'Offer mismatch: Ad promises 8 free replacement heads included for $29; package only includes 2 heads (8-pack costs additional $18).',
    description: 'Bundle contents exaggerated in ad headline.',
  },
];
