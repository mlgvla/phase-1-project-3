document.addEventListener('DOMContentLoaded', () => {
    const pokemonList = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';
    
    fetch(pokemonList)
    .then(res => res.json())
    .then(data => getInfo(data.results))
})

async function getInfo(data) {
    console.log(data)
    data.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
    console.log(data)
    const pokemonInfo = {};
    for (let i = 0; i < data.length; i++) {
        pokemonInfo[i] = {};
        pokemonInfo[i]['name'] = data[i].name;
        pokemonInfo[i]['favorite'] = false;
        await fetchPokemon(i, data, pokemonInfo)
    }
    createPage(pokemonInfo);
}
async function fetchPokemon(i, data, pokemonInfo) {
    await fetch(data[i].url)
    .then(res => res.json())
    .then(info => {
        pokemonInfo[i]['abilities'] = info.abilities;
        pokemonInfo[i]['stats'] = info.stats;
        pokemonInfo[i]['types'] = info.types;
        pokemonInfo[i]['image'] = info.sprites.other['official-artwork']['front_default'];
        return;
    })
    
}

function createPage(info) {
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = `
        <div  class="d-flex justify-content-center align-items-center">
            <input type="checkbox" name="favorite" value="show-all">
            <label class="ps-1" for="favorite">Favorites</label>
        </div>
    `
    let check = document.getElementsByTagName('input')[0];
    
    
    let ul = document.createElement('ul');
    ul.setAttribute('class','list-group list-group-horizontal d-flex flex-wrap justify-content-center')
    body.appendChild(ul);
    ul.setAttribute('style', 'list-style: none')
    createList(info, check.value);
    check.addEventListener('change', (event) => {
        if (event.target.value === 'show-all') {
            event.target.value = 'show-favorites'
        }
        else {
            event.target.value = 'show-all'
        }
        createList(info, event.target.value);
    })
    
    
    
}

function createList(info, value) {
    const body = document.getElementsByTagName('body')[0];
    const ul = document.getElementsByTagName('ul')[0];
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstChild);
    }
    let i = 0;
    
    while (info[i]) {
        if (info[i]['favorite'] === true || value === 'show-all') {
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
            let div = document.createElement('div');
            let name = info[i]['name'].slice(0, 1).toUpperCase() + info[i]['name'].slice(1, info[i]['name'].length);
            div.innerHTML = `
                <p>${i+1}. ${name}</p>            
                <img src="${info[i]['image']}" height="200" width="200"/>
            `
            li.appendChild(div);
            if (!checkCard(body)) {
                createCard(info, li.childNodes[0].childNodes[1]);
            }
            li.addEventListener('click', clickEvent);
            ul.appendChild(li);
        }
        i++;
    }

    function clickEvent(event) {
        createCard(info, event.path[1].childNodes[1]);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

function checkCard(body) {
    return body.firstChild === document.getElementById('card')
}

function createCard(pokemonList, target) {
    let index = target.textContent.split('. ')[0] - 1;
    let pokemon = pokemonList[index];
    let div = document.createElement('div');
    const body = document.getElementsByTagName('body')[0];
    body.removeChild(body.childNodes[0]);
    body.insertBefore(div, body.firstChild);
    let abilities = makeString(pokemon, 'abilities', 'ability');
    let types = makeString(pokemon, 'types', 'type');
    div.setAttribute('class', 'card top-0 start-50 translate-middle-x');
    div.setAttribute('id', 'card');
    div.setAttribute('style', 'width: 30rem;')
    let name = pokemon.name.slice(0, 1).toUpperCase() + pokemon.name.slice(1, pokemon.name.length);
    div.innerHTML = `
        <img src="${pokemon.image}" class="card-img-top"/>
        <div class="card-body text-center">    
            <h5 class="card-title text-center"><b>${name}</b> <span></span></h5>
            <p class="card-text text-center">Abilities: ${abilities}</p>
            <p class="card-text text-center">Types: ${types}</p>
            <table class="d-flex justify-content-center text-start">    
                <tr>
                    <td class="card-text pe-3">HP: ${pokemon.stats[0]['base_stat']}</td>
                    <td class="card-text">Attack: ${pokemon.stats[1]['base_stat']}</td>
                </tr>
                <tr>
                    <td class="card-text pe-3">Defense: ${pokemon.stats[2]['base_stat']}</td>
                    <td class="card-text">Sp. Attack: ${pokemon.stats[3]['base_stat']}</td>
                </tr>
                <tr>
                    <td class="card-text pe-3">Sp. Defense: ${pokemon.stats[4]['base_stat']}</td>
                    <td class="card-text">Speed: ${pokemon.stats[5]['base_stat']}</td>
                </tr>
            </table>
        </div>
        `
    //<p class="card-text">HP: ${pokemon.stats[0]['base_stat']} Attack: ${pokemon.stats[1]['base_stat']} <br>Defense: ${pokemon.stats[2]['base_stat']} Sp. Attack: ${pokemon.stats[3]['base_stat']} <br>Sp. Defense: ${pokemon.stats[4]['base_stat']} Speed: ${pokemon.stats[5]['base_stat']}</p>
    let span = document.getElementsByTagName('span')[0];
    span.setAttribute('style', 'color:gold');
    if (pokemon.favorite === true) {
        span.textContent = '★'
    }
    else {
        span.textContent = '☆'
    }
    span.addEventListener('click', favoritePokemon);
    function favoritePokemon(event) {
        if (pokemon.favorite === true) {
            span.textContent = '☆';
            pokemon.favorite = false;
        }
        else {
            span.textContent = '★'
            pokemon.favorite = true;
        }
    }
}

function makeString(pokemon, key, keyTwo) {
    let attribute = '';
    for (let i = 0; i < pokemon[key].length; i++) {
        let text = pokemon[key][i][keyTwo]['name'];
        text = text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
        attribute = attribute + `${text}, `
    } 
    attribute = attribute.slice(0, -2);
    return attribute;
}