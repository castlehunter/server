/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 * 
 *  Name: Qing Zhang    Student ID: 130982218   Date: May 25, 2023
 *
 ********************************************************************************/


let page = 1;
let perPage = 10;

function loadMovieData(title = null) {

    let endpoint;
    const pagination = document.querySelector(".pagination");

    if (title != null) {
        pagination.classList.add("d-none");
        endpoint = `https://periwinkle-hare-boot.cyclic.app/api/movies?page=1&perPage=${perPage}&title=${title}`;
    } else {
        pagination.classList.remove("d-none");
        endpoint = `https://periwinkle-hare-boot.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
    }

    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            let dataContent = data.map(record => (`<tr data-id=${record._id}>
                     <td>${record.year}</td>
                     <td>${record.title}</td>
                     <td>${record.plot}</td>
                     <td>${record.rated}</td>
                     <td>${Math.floor(record.runtime / 60)}:${(record.runtime % 60).toString().padStart(2, '0')}</td>
                </tr>`)).join(' ');

            document.querySelector("#moviesTable tbody").innerHTML = dataContent;
            document.querySelector("#current-page").textContent = page;
            clickRecord();
        });

    function clickRecord() {
        document.querySelectorAll("[data-id]").forEach(element => {
                    element.addEventListener('click', () => {
                                fetch(`https://periwinkle-hare-boot.cyclic.app/api/movies/${element.getAttribute("data-id")}`)
                                    .then(res => res.json())
                                    .then(data => {
                                            document.querySelector("#detailsModal .modal-title").innerHTML = `${data.title}`;
                                            document.querySelector("#detailsModal .modal-body").innerHTML =
                                                `${data.poster!=null? `<img class="img-fluid w-100" src="${data.poster}"><br><br>`:`<div class="d-none"></div>`}
                            <strong>Directed By:</strong> ${(data.directors).join(', ')}<br><br>
                            <p>${data.fullplot != null? data.fullplot: ``}</p>
                            <strong>Cast:</strong> ${data.cast && data.cast.length > 0 ?(data.cast).join(', '):`N/A`}<br><br>
                            <strong>Awards:</strong> ${data.awards.text}<br>
                            <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
                            ` ;
                            let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                                backdrop: "static",
                                keyboard: false
                            });
                        modal.show();
                    })
            })
        })
    }

}

document.addEventListener('DOMContentLoaded', () => {
    loadMovieData();
    document.getElementById("previous-page").addEventListener('click', e => {
        if (page > 1) {
            page = page - 1;
            loadMovieData();
        }
    })

    document.getElementById("next-page").addEventListener('click', e => {
        page = page + 1;
        loadMovieData();
    })

    document.getElementById("searchForm").addEventListener('submit', e => {
        e.preventDefault();
        loadMovieData(document.getElementById("title").value);
    })

    document.getElementById("clearForm").addEventListener('click', e => {
        document.getElementById("title").value = "";
        loadMovieData();
    })
})