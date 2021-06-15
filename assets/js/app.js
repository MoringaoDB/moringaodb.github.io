document.addEventListener('DOMContentLoaded', async function () {

    const db = firebase.firestore();

    var docRef = db.collection("Moringa-Entries").doc("121");

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


    const searchByName = async ({
        search = '',
        limit = 5,
        lastNameOfLastPerson = ''} = {}) => {
        const snapshot = await db.collection('Moringa-Entries')
            .where('Plant part being used', 'array-contains', search.toLowerCase())
            .orderBy('Title')
            .startAfter(lastNameOfLastPerson)
            .limit(limit)
            .get();

        const convertDocumentToTableRows = (acc, doc) => {
        const moringaoDB = doc.data();

        const card = document.createElement('div');
        card.className = "card";

        const title = moringaoDB['Title'];
        const year = moringaoDB['Year of Publication'];
        const authors = moringaoDB['Authors'];
        const type = moringaoDB['Type of Paper'];
        const disease = moringaoDB['Disease & Cell Line'];
        const part = moringaoDB['Plant part being used'];
        const focus = moringaoDB['Primary Focus'];
        const comments = moringaoDB['Comments']
        const doi = moringaoDB['DOI/ Link']

        console.log(moringaoDB)

        const body = 
        `<div class="card__title">`+
            `${title}`+
        `</div>`+
        `<span class="card__year">`+
            `<b>Year of Publication:</b> &nbsp`+
            `<span class="badge bg-light text-dark">`+
                `${year}`+
            `</span>`+
        `</span>`+
        `<span class="card__author">`+
            `<b>Authors:</b> &nbsp ${authors}`+
        `</span>`+
        `<div class="card__text">`+
            `<div class="table-responsive">`+
                `<table class="table table-bordered table-hover">`+
                    `<thead>`+
                        `<tr>`+
                        `<th scope="col">Primary Focus</th>`+
                        `<th scope="col">Part</th>`+
                        `<th scope="col">Disease/Cell Line/Model/Strain</th>`+
                        `<th scope="col">Type</th>`+
                        `</tr>`+
                    `</thead>`+
                    `<tbody>`+
                        `<tr>`+
                            `<td>${focus}</td>`+
                            `<td>${part}</td>`+
                            `<td>${disease}</td>`+
                            `<td>${type}</td>`+
                        `</tr>`+
                    `</tbody>`+
                `</table>`+
            `</div>`+
            `<span class="card__comments">`+
                `<b>Comments:</b> &nbsp ${comments}`+
            `</span>`+
        `</div>`+
        `<a href="${doi}" class="card__button" target="_blank">DOI/Link</a>`

        card.innerHTML = body;

        return acc.concat(card);

        };

        const wrapTableRowsInFragment = (acc, card) => {
            acc.appendChild(card);
            return acc;
        }

        return snapshot
            .docs
            .reduce(convertDocumentToTableRows, [])
            .reduce(wrapTableRowsInFragment, document.createDocumentFragment());

    };

    const textBoxSearch = document.querySelector('#textBoxSearch');
    const rowsPeople = document.querySelector('#moringaEntries');

    const updatePeopleRows = fragment => {
        while (rowsPeople.hasChildNodes()) rowsPeople.removeChild(rowsPeople.firstChild); // Remove all children
        rowsPeople.appendChild(fragment);
    }

    updatePeopleRows(await searchByName());
    textBoxSearch.addEventListener('keyup', async (e) => updatePeopleRows(await searchByName({ search: e.target.value })));

    async function lazyLoad() {

        const scrollIsAtTheBottom = (document.body.scrollHeight - window.innerHeight) <= window.scrollY;
        //console.log(scrollIsAtTheBottom)

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