const searchService = require('../services/searchService');

const search = async (req, res) => {
  try {
    const { q, type, category, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.json({ success: true, data: [], total: 0 });
    }

    const results = await searchService.search(q, { type, category, page, limit });
    
    res.json({ 
      success: true, 
      data: results.results || [], 
      total: results.total || 0,
      query: q 
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const suggestions = await searchService.getSuggestions(q);
    
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPopularSearches = async (req, res) => {
  try {
    const popular = await searchService.getPopularSearches();
    res.json({ success: true, data: popular });
  } catch (error) {
    console.error('Popular searches error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  search, 
  searchSuggestions, 
  getPopularSearches 
};