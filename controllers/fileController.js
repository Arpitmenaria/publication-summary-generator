const bibtexParse = require('bibtex-parse-js');
const fs = require('fs');

exports.uploadFile = (req, res) => {
  const filePath = req.file.path;
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  try {
    const publications = bibtexParse.toJSON(fileContent);
    const summary = generateSummary(publications);

    fs.unlinkSync(filePath); // Remove uploaded file after parsing

    res.json({ publications, summary });
  } catch (error) {
    res.status(500).json({ error: 'Error parsing file' });
  }
};

function generateSummary(publications) {
  const totalPublications = publications.length;
  const journalCount = publications.filter(pub => pub.entryType === 'article').length;
  const conferenceCount = publications.filter(pub => pub.entryType === 'inproceedings').length;
  return {
    totalPublications,
    journalCount,
    conferenceCount,
    yearRange: getYearRange(publications),
  };
}

function getYearRange(publications) {
  const years = publications.map(pub => parseInt(pub.entryTags.year)).filter(Boolean);
  if (years.length === 0) return 'No year data';
  return `${Math.min(...years)} - ${Math.max(...years)}`;
}
