document.addEventListener('DOMContentLoaded', async function() {

  const db = firebase.firestore();

  db.collection("Moringa-Entries").get().then((querySnapshot) => {
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().Title}`);
});
});

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

      const h = document.createElement('h4');
      h.className = "mbr-section-subtitle mbr-fonts-style mb-4 display-5";
      h.textContent = moringaoDB['Title'];
      div3.appendChild(h);

      const author = document.createElement('p');
      /*disease.className = "mbr-section-subtitle mbr-fonts-style mb-4 display-5";*/
      author.textContent = "Authors: " + moringaoDB['Authors'];
      div3.appendChild(author);

      const disease = document.createElement('p');
      /*disease.className = "mbr-section-subtitle mbr-fonts-style mb-4 display-5";*/
      disease.textContent = "Disease/Cell Line/Model/Strain: " + moringaoDB['Disease/Cell Line/Model/Strain'];
      div3.appendChild(disease);

      const focus = document.createElement('p');
      /*disease.className = "mbr-section-subtitle mbr-fonts-style mb-4 display-5";*/
      focus.textContent = "Primary Focus: " + moringaoDB['Primary Focus'];
      div3.appendChild(focus);

      const publication = document.createElement('p');
      /*disease.className = "mbr-section-subtitle mbr-fonts-style mb-4 display-5";*/
      publication.textContent = "Year of Publication: " + moringaoDB['Year of Publication'];
      div3.appendChild(publication);

      const doi = document.createElement('a');
      doi.className = "btn btn-success display-4";
      doi.href = moringaoDB['DOI/ Link']
      doi.target="_blank"
      doi.textContent = "DOI/Link"
      div3.appendChild(doi);

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
