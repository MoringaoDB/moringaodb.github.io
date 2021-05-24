
/*
document.addEventListener('DOMContentLoaded', async function() {

    const firebaseConfig = {
        apiKey: "AIzaSyAzjHVWl0M-0O7z9EYJqvprSBILsv-AZuk",
        authDomain: "moringaodb.firebaseapp.com",
        projectId: "moringaodb",
        storageBucket: "moringaodb.appspot.com",
        messagingSenderId: "926960248992",
        appId: "1:926960248992:web:60d617a0d47141d09241c5",
        measurementId: "G-FFBL1E2Q03"
    };

    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

    const searchByName = async ({
      search = '',
      limit = 10,
      lastNameOfLastPerson = ''
    } = {}) => {
      const snapshot = await db.collection('Moringa-Entries')
        .where('keywords', 'array-contains', search.toLowerCase())
        .orderBy('Title')
        .startAfter(lastNameOfLastPerson)
        .limit(limit)
        .get();

      console.log(snapshot);
      return snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc.concat(`
          <tr>
            <td>${data.Title}</td>
            <td>${data['Disease/Cell Line/Model/Strain']}</td>
            <td>${data['Primary Focus']}</td>
            <td>${data['Year of Publication']}</td>
          </tr>`);
      }, '');
    };

    const textBoxSearch = document.querySelector('#searchBox');
    const rowsPeople = document.querySelector('#rowsPeople');
    rowsPeople.innerHTML = await searchByName();

    textBoxSearch.addEventListener('keyup', async (e) => rowsPeople.innerHTML = await 
    searchByName({search: e.target.value}));

    /*
    async function lazyLoad() {
      const scrollIsAtTheBottom = (document.documentElement.scrollHeight - window.innerHeight) === window.scrollY; 
      if (scrollIsAtTheBottom) {
        const lastNameOfLastPerson = rowsPeople.lastChild.firstElementChild.textContent;

        rowsPeople.innerHTML += await searchByName({
          search: textBoxSearch.value,
          lastNameOfLastPerson: lastNameOfLastPerson
        });
      }
    }
    window.addEventListener('scroll', lazyLoad); 
}); */


document.addEventListener('DOMContentLoaded', async function() {

  const db = firebase.firestore();

  const searchByName = async ({
    search = '',
    limit = 5,
    lastNameOfLastPerson = ''
  } = {}) => {
    const snapshot = await db.collection('Moringa-Entries')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('Title')
      .startAfter(lastNameOfLastPerson)
      .limit(limit)
      .get();

    const convertDocumentToTableRows = (acc, doc) => {
      const moringaoDB = doc.data();
      const tr = document.createElement('tr');

      const names = [ moringaoDB.Title, 
                      moringaoDB['Disease/Cell Line/Model/Strain'], 
                      moringaoDB['Primary Focus'], 
                      moringaoDB['Year of Publication'] ];   
   
      names.map(n => {
        const td = document.createElement('td');
        td.textContent = n;
        tr.appendChild(td);
      });

      return acc.concat(tr);
    };
    const wrapTableRowsInFragment = (acc, tr) => {
        acc.appendChild(tr);
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