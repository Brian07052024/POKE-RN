import { typeColors, regions } from "./constants.js";
import { buildPokemon } from "./buildPokemon.js";

export async function renderRegion(pkmnContainer, renderToken, activeType, lastRegion, regionName, pokemonCallForLotes = 50, typeSelected) {
    renderToken++; // Incrementa el token global
    const myToken = renderToken; // Guarda el token local
    pkmnContainer.innerHTML = "";
    typeSelected = activeType;

    const actualRegion = document.querySelector(`#${regionName}`);

    if (regionName !== lastRegion) {
        const deleteColor = document.querySelector(`#${lastRegion}`);
        deleteColor.classList.remove("bg-yellow-500");
        deleteColor.classList.add("bg-white");
        actualRegion.classList.add("bg-yellow-500");
        actualRegion.classList.remove("bg-white");
    } else {
        actualRegion.classList.add("bg-yellow-500");
        actualRegion.classList.remove("bg-white");
    };

    lastRegion = actualRegion.id;

    const { start, end } = regions[regionName];
    const ids = [];
    for (let i = start; i <= end; i++) ids.push(i);

    let pokemons = [];

    for (let i = 0; i < ids.length; i += pokemonCallForLotes) {
        if (myToken !== renderToken) return;
        const groupPokemon = ids.slice(i, i + pokemonCallForLotes);
        const batchFetches = groupPokemon.map(id =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json())
        );
        try {
            const batchResults = await Promise.all(batchFetches);

            if (myToken !== renderToken) return;

            if (activeType !== "all") {
                const batchFiltrado = batchResults.filter(pokemon =>
                    pokemon.types.some(tipo => tipo.type.name === activeType));
                pokemons = pokemons.concat(batchFiltrado);
            } else {
                pokemons = pokemons.concat(batchResults);
            }


        } catch (error) {
            pkmnContainer.innerHTML = `
                    <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center py-10 bg-black/90 ">
                        <img src="./src/img/error-pokemon.png" alt="Error" class="w-40 h-40 mb-4" />
                        <p class="text-red-700 font-bold text-2xl">¡Algo salió mal!</p>
                        <p class="text-red-300 font-bold text-2xl">[Pókemon desconocido]</p>
                        <a href="index.html" class="inline-block py-1 px-4 bg-cyan-600 text-4xl text-white rounded-2xl border-black border-4">
                            Volver
                        </a>
                    </div>
                `;
            return;
        };
    };

    if (myToken === renderToken) {
        buildPokemon(pokemons, pkmnContainer);
    }

    return { region: actualRegion.id, lastRegion: actualRegion.id };
};