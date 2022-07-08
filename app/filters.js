const strUtils = require('../lib/string-utils');

const idify = text => text.toLowerCase().replaceAll(' ', '-');
const sentence = text => strUtils.toSentenceCase(text);
const email = session => `${session.firstName.toLowerCase()}.${session.lastName.toLowerCase()}@example.com`;
const fullName = session => `${session.firstName} ${session.lastName}`;

const navbarLinks = (userType, staffPreSignIn = false) => {
  if (staffPreSignIn) return [{ href: '/staff/sign-in', text: 'Staff Sign In' }];

  if (!userType) return [{ href: '/sign-in', text: 'Sign In' }];

  if (userType === 'citizen') return [{ href: '/sign-out', text: 'Sign Out' }];

  return [
    { href: '/',                     text: 'Home' },
    { href: '/dashboard',            text: 'Dashboard' },
    { href: '/staff-members',        text: 'Staff Admin' },
    { href: '/management',           text: 'Management' },
    { href: '/call-centre-actions',  text: 'Call Centre Actions' },
    { href: '/bulk-upload',          text: 'Bulk Upload' },
    { href: '/search',               text: 'Search Individuals' },
    { href: '/local-authorities',    text: 'Local Authorities' },
    { href: '/sign-out',       text: 'Sign Out' }
  ];
};

const govukSummary = summaryData => {
  return summaryData.map(row => {
    return {
      key: { text: row.label },
      value: { text: row.value},
      actions: {
        items: row.change ? [{
          href: row.change,
          text: 'Change',
          visuallyHiddenText: row.label.toLowerCase()
        }] : []
      }
    }
  })
};

module.exports = function (_env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {};

  filters.idify = idify;
  filters.sentence = sentence;
  filters.email = email;
  filters.fullName = fullName;
  filters.navbarLinks = navbarLinks;
  filters.govukSummary = govukSummary;

  return filters;
};
