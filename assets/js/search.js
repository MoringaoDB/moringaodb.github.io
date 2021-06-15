const search = instantsearch({
    searchClient: algoliasearch(
        'X4XVBZC5US',
        'bd38b1c23e6bfc4ea1aa00207c7ac9aa'
    ),
    indexName: 'MoringaoDB'
});


search.addWidget({
      init(opts) {
        const helper = opts.helper;
        const input = document.querySelector('#textBoxSearch');
        input.addEventListener('input', ({currentTarget}) => {
          helper.setQuery(currentTarget.value) // update the parameters
                .search(); // launch the query
        });
      }
    });

search.addWidget({
    render(options) {
      const results = options.results;




      // read the hits from the results and transform them into HTML.
      document.querySelector('#moringaEntries').innerHTML = results.hits
        .map(hit => `
                <div class="card">
                    <div class="card__title">
                        ${hit.Title}
                    </div>
                    <span class="card__year">
                        <b>Year of Publication:</b> &nbsp
                        <span class="badge bg-light text-dark">
                            ${hit.Year}
                        </span>
                    </span>
                    <span class="card__author">
                        <b>Authors:</b> &nbsp ${hit.Authors}
                    </span>
                    <div class="card__text">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                    <th scope="col">Primary Focus</th>
                                    <th scope="col">Part</th>
                                    <th scope="col">Disease & Cell Line</th>
                                    <th scope="col">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${hit.Focus}</td>
                                        <td>${hit.Part}</td>
                                        <td>${hit.Disease_Cell_Line}</td>
                                        <td>${hit.Type}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <span class="card__comments">
                            <b>Comments:</b> &nbsp ${hit.Comments}
                        </span>
                    </div>
                    <a href="${hit.Link}" class="card__button" target="_blank">DOI/Link</a>
                </div>
                `)
        .join('');
    },
  })

  
search.start();

