document.addEventListener('DOMContentLoaded', async function() {

  const db = firebase.firestore();

  const searchByName = async ({
    search = '',
    limit = 5,
    lastNameOfLastPerson = ''
  } = {}) => {
    const snapshot = await db.collection('Moringa-Entries')
      .where('Keywords', 'array-contains', search.toLowerCase())
      .orderBy('Title')
      .startAfter(lastNameOfLastPerson)
      .limit(limit)
      .get();
    

    const convertDocumentToTableRows = (acc, doc) => {
      const moringaoDB = doc.data();

      const section = document.createElement('section');
      section.className = "content5 cid-syvC2figns";
      section.id = "content5-x";
      
      const div1 = document.createElement('div');
      div1.className = "container";
      section.appendChild(div1);
      
      const div2 = document.createElement('div');
      div2.className = "row justify-content-center";
      div1.appendChild(div2);
      
      const div3 = document.createElement('div');
      div3.className = "col-md-12 col-lg-10";
      div2.appendChild(div3);
      
      const body = `<h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5">${moringaoDB['Title']}</h4><p class="mbr-text mbr-fonts-style display-7">Authors: ${moringaoDB['Authors']}</p><p class="mbr-text mbr-fonts-style display-7">Disease/Cell Line/Model/Strain: ${moringaoDB['Disease/Cell Line/Model/Strain']}</p><p class="mbr-text mbr-fonts-style display-7">Primary Focus: ${moringaoDB['Primary Focus']}</p><p class="mbr-text mbr-fonts-style display-7">Year of Publication: ${moringaoDB['Year of Publication']}</p><a href="${moringaoDB['DOI/ Link']}" class="btn btn-success display-4" target="_blank">DOI/Link</a>`
      
      
      
      div3.innerHTML = body;
      return acc.concat(section);
    };
    const wrapTableRowsInFragment = (acc, section) => {
        acc.appendChild(section);
        return acc;
      }
    return snapshot
      .docs
      .reduce(convertDocumentToTableRows, [])
      .reduce(wrapTableRowsInFragment, document.createDocumentFragment());
  };

  const textBoxSearch = document.querySelector('#textBoxSearch');
  const rowsPeople = document.querySelector('#rowsPeople');

  const updatePeopleRows = fragment => {
    while (rowsPeople.hasChildNodes()) rowsPeople.removeChild(rowsPeople.firstChild); // Remove all children
    rowsPeople.appendChild(fragment);
  }

  updatePeopleRows(await searchByName());

  textBoxSearch.addEventListener('keyup', async (e) => updatePeopleRows(await searchByName({search: e.target.value})));

  async function lazyLoad() {
    const scrollIsAtTheBottom = (document.documentElement.scrollHeight - window.innerHeight) === window.scrollY; 
    if (scrollIsAtTheBottom) {
      const lastNameOfLastPerson = rowsPeople.lastChild.firstElementChild.textContent;

      rowsPeople.appendChild(await searchByName({
        search: textBoxSearch.value,
        lastNameOfLastPerson: lastNameOfLastPerson
      }));
    }
  }
  window.addEventListener('scroll', lazyLoad);
  });