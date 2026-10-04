// Category demand weights based on customer lifetime value and search volume
const CATEGORY_DEMAND_WEIGHTS = {
  dentist: 95,
  dental: 95,
  roofer: 95,
  roofing: 95,
  hvac: 90,
  plumber: 90,
  plumbing: 90,
  electrician: 85,
  lawyer: 90,
  automechanic: 80,
  'car repair': 80,
  landscaper: 75,
  bakery: 70,
  restaurant: 75,
  gym: 80,
  salon: 70,
  default: 65
};

function getCategoryDemand(category = '') {
  const catLower = (category || '').toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_DEMAND_WEIGHTS)) {
    if (catLower.includes(key)) return val;
  }
  return CATEGORY_DEMAND_WEIGHTS.default;
}

/**
 * Skill 2: Score
 * Ranks each prospect 1-100 based on review count, category demand, and how much they'd benefit from a website
 */
function scoreProspect(prospect) {
  const reviews = Number(prospect.review_count) || 10;
  const rating = Number(prospect.rating) || 4.5;
  const categoryDemand = getCategoryDemand(prospect.category);

  // 1. Review Count Factor (Max 35 pts): High reviews without a website means huge existing trust but zero digital conversion funnel!
  // 5 reviews = 10 pts, 30 reviews = 25 pts, 80+ reviews = 35 pts
  let reviewScore = Math.min(35, Math.round((reviews / 80) * 35));
  if (reviewScore < 8) reviewScore = 8;

  // 2. Category Demand Factor (Max 30 pts): High-ticket services benefit exponentially from website quote requests
  const categoryScore = Math.round((categoryDemand / 100) * 30);

  // 3. Website Need Factor (Max 25 pts): No website currently listed, presence of phone/email
  let needScore = 20;
  if (prospect.phone) needScore += 3;
  if (prospect.email) needScore += 2;
  if (prospect.has_website === 'yes') needScore = 5; // drastically lower if they already have one

  // 4. Reputation / Budget Factor (Max 10 pts): High rating (4.5+) indicates active business with money to spend
  let repScore = Math.round((rating / 5.0) * 10);

  const totalScore = Math.min(100, Math.max(1, reviewScore + categoryScore + needScore + repScore));

  let tier = 'Standard';
  if (totalScore >= 85) tier = 'Hot Lead (Urgent Need)';
  else if (totalScore >= 70) tier = 'High Potential';
  else if (totalScore >= 50) tier = 'Moderate';

  return {
    ...prospect,
    lead_score: totalScore,
    score_breakdown: {
      total: totalScore,
      tier,
      review_score: reviewScore,
      review_count: reviews,
      category_score: categoryScore,
      category_demand: categoryDemand,
      website_need_score: needScore,
      reputation_score: repScore,
      rating
    }
  };
}

module.exports = {
  scoreProspect,
  getCategoryDemand
};
