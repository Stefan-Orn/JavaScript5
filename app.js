//Þetta eru allt breytur þar sem ég geymi html hluti sem ég vísa í oftast með ID
const slider = document.getElementById("slider");
const minDisp = document.getElementById("min");
const maxDisp = document.getElementById("max");
const displayVerd = document.querySelector("output");
const searchBar = document.getElementById("search");
const dateContainer = document.getElementById("date-container");
const searchContainer = document.getElementById("searchContainer")
const dateFrom = document.getElementById("date-from");
const dateTo = document.getElementById("date-to");
const hideButton = document.getElementById("hide");
const showButton = document.getElementById("show");
const homePage = document.getElementById("homePage");
const addPage = document.getElementById("addPage");

let fromDate = 0;
let toDate = 0;


//Þessar breytur koma allar fyrir í initialize fallinu en ég þurfti að skilgreina þær hérna til þess aðhafa þær global
let myndir_sorted_date = []
let minDate = 0;
let maxDate = 0;
let myndir_sorted = []
let minVerd = 0;
let maxVerd = 0;
let cards= []

const cardContainer = document.getElementById("content-container")  
let myndir = [];
//console.log(nafn.value,hofu.value,fmynd.value,fverd.value,fdate.value);
await fetch('json/gogn.json')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
      //console.log(data);
	  for(let i = 0; i<data.myndir.length; i++){
			myndir.push({
                heiti:data.myndir[i].heiti,
                hofundur:data.myndir[i].hofundur,
                dagsetning:data.myndir[i].dagsetning,
                verd:data.myndir[i].verd,
                vefslod:data.myndir[i].vefslod
            })
	   }
		// Skoðum concertEvents fylkið
		//console.log(concertEvents);
        //console.log(myndir);
        //Allt hér fyrir ofan eru breytur sem mér þótti henntugt að skilgreina efst uppá snyrtileikann að gera

        //Hér geri ég nokkrar breytur til þess að geyma nokkrar mikilvægar upplýsingar um fylkið
        //Ég set þær ællar í þetta functiono hérna til þess að hafa þetta aðeins snyrtilegra. Ég kalla fallioð initialize þar sem að það passar
        function initialize(){
            
            //const myndir_sorted = myndir.sort(myndir.verd); (Þetta virkaði ekki)
            //Hér byrja ég að gera þessa breytu sem sortar myndir arrayið eftir dagsetningu til þess að stilla min og max í date rétt 
            myndir_sorted_date = myndir.sort(function (c,d){
                
                return new Date(c.dagsetning) - new Date(d.dagsetning);
            });
            minDate = myndir_sorted_date[0].dagsetning;
            maxDate = myndir_sorted_date[myndir_sorted_date.length -1 ].dagsetning;
            //Síðan sorta ég myndir uppá nýtt og geymi í nýrri breytu, myndir_sorted, en það er til þess að myndirnar raðist upp efgtir verði
            myndir_sorted = myndir.sort(function (a, b) {
                return a.verd - b.verd;
            });
            minVerd = myndir_sorted[0].verd;
            maxVerd = myndir_sorted[myndir_sorted.length -1 ].verd;
            //Hér bý ég til allar myndinar og næ síðan í þær. Ég þarf að gera það eftir að þær hafa verið sortaðar til þess að foriitið gangi upp
            createCards(myndir_sorted);
            cards = document.querySelectorAll("[id=card]");
    
            //Þetta er leioð til þess að raða lista af objects upp eftir einhverju property'i inn í einu objectinu sem ég vill að sé verð
            //console.log(myndir_sorted);
            //console.log(myndir_sorted);
            //console.log(myndir_sorted);
            //Þetta er partur af stýlun en hérna er ég að taka hæsta og lægsta gildi í arrayinu og setja það í breytur sem eru í css og html (datasets)
            //í html er ég með tvö lable, eitt á undan sliderinum og eitt á eftir en þá get ég sett lægsta gildið vinstra megin og hæsta hægramegin
            slider.min = minVerd;
            slider.max = maxVerd;
            //console.log(minDate);
            //console.log(maxDate);
            dateFrom.min = minDate;
            dateFrom.max = maxDate;
            dateTo.min = minDate;
            dateTo.max = maxDate;
            //console.log(dateFrom.min)
    
            minDisp.dataset.min = minVerd;
            maxDisp.dataset.max = maxVerd;
            displayVerd.value = slider.min;
            //console.log(slider.min,slider.max);
            //console.log(cards);
        }

        //Hér koma functions

        //Show functionið sér um að byrta viðeigandi myndir þegar notað er einhvað af leitaraðferðunum. Þetta er allt í einum pakka
        //þar sem mér fannst það makea sens en það gerði þetta aðeins meira verkefni sem mér finnst bara gaman
        function show(currentVerd, search, fDate, tDate){
            let synaVerd = myndir_sorted.map(mynd => mynd.verd <= currentVerd);
            let tel = 0;
            const gildi = search.toLowerCase();
            //console.log(fromDate);
            //console.log(toDate);
            //console.log(gildi);
            //console.log(synaVerd);
            //Fyrsta if setningin keyrir ef að notandinn er að nota search barinn. Else if er þegar notandinn notar dagataliðo. Annars keyrir else sem er þegar notandinn notar sliderinn
            if(search != ""){

                myndir_sorted.forEach(mynd => {
                    const synaFraHof = mynd.hofundur.toLowerCase().includes(gildi) || mynd.dagsetning.toLowerCase().includes(gildi);
                    //console.log("Hofundur úr myndir: ",mynd.hofundur);
                    //console.log("syna",syna);
                    //console.log("divið",cards[tel]);
                    if(synaFraHof == true){
                        //console.log("Inni í true")
                        //console.log(cards[tel])
                        cards[tel].classList.remove("off");
                    }else{
                        cards[tel].classList.add("off");
                    }
                    //console.log("divið eftir",cards[tel]);
                    tel++;
                })
            } 
            else if(fDate !== 0 && tDate !== 0){
                const fromDate = new Date(fDate);
                const toDate = new Date(tDate);
                let tel = 0;
                //console.log(fromDate);
                //console.log(toDate);
                
                myndir_sorted.map(mynd => {
                    const synaFraDags = new Date(mynd.dagsetning) >= fromDate && new Date(mynd.dagsetning) <= toDate;
                    //console.log("Er þetta að virka",synaFraDags);
                    if(synaFraDags == true){
                        //console.log("Fer inn i if")
                        cards[tel].classList.remove("off");
                    }else{
                        cards[tel].classList.add("off");
                    }

                    tel++;
                })
            }
            else{
            //console.log(syna);
                for(let i = 0; i < cards.length; i++){
                    //console.log(i);
                    if(synaVerd[i] == true){
                        cards[i].classList.remove("off");
                    }else{
                        cards[i].classList.add("off");
                    }
                }
            }

        }
        //createCards functionið er notað til þess að búta til öll "cards" eins og ég kalla það og æla þeim á síðuna.
        //Mér finnst aðferin sem ég dálítið subbuleg og skrítin en hún virkar. Ég bjó til demo í html áður en ég útfærði þetta fall til þess að sja
        //hvað ég þurfti fyrir hvert "card". Síðan kom ég hingað, bjó til öll elementin og tengdi viðeigandi upplýsingar við þau
        //Ég hefði örgglega getað notað forEach hérna en ég bara gleymdi því og það sest kannski í kóðanum þar sem að ég byrjaði allt í einu að nota meira
        //forEach.
        function createCards(myndir){
            for(let i = 0; i < myndir.length; i++){
                let div = document.createElement("div");//Þetta er div er eitt "card". Síðan kemur allt innihaldið eftir á
                let h1 = document.createElement("h1");
                let h2 = document.createElement("h2");
                let img = document.createElement("img");
                let h3 = document.createElement("h3");
                let p = document.createElement("p");
                div.classList.add("off"); //Set class á divið sem byrjar á off svo að allt sé ekki sýnilegt þegar notandinn opnar síðuna
                div.setAttribute("id","card") //Síðan set eg lika id til þess að ná síðan í öll divin eftir á
                //console.log(div);
                h1.textContent = myndir[i].heiti;
                h2.textContent = myndir[i].hofundur;
                //console.log(myndir[i].hofundur);
                img.src = myndir[i].vefslod;
                //console.log(myndir[i].vefslod);
                h3.textContent = "verd: "+myndir[i].verd +"kr";
                p.textContent = myndir[i].dagsetning;
                //console.log(h1);
                //Síðan er þetta parturinn sem ég hendi öllu inn í div og æli síðan út. Þetta gerist síðan fyrir hvert object í myndir arrayinu
                div.append(h1);
                div.append(h2);
                div.append(img);
                div.append(h3);
                div.append(p);
                //console.log(div);
                cardContainer.appendChild(div);
            }
            
        }

        //Hér koma allir evenlistenarar
        slider.addEventListener("input", e => { 
            displayVerd.value = e.target.value;
            show(e.target.value,"",0,0);
        // console.log(slider.value);
        });
        searchBar.addEventListener("input", e =>{
            //console.log(searchBar.value);
            show(minVerd,e.target.value,0,0);
        })
        dateContainer.addEventListener("input", e => {

            if(e.target.id == "date-from"){
                fromDate = e.target.value;
            }else{
                toDate = e.target.value;
            }
            //console.log(fromDate);
            show(minVerd,"",fromDate, toDate);

        })
        hideButton.addEventListener("click", e => {
            //console.log("jallo")
            searchContainer.classList.add("disablePage");
            showButton.classList.remove("disablePage");
            document.documentElement.style.setProperty('--display','0');
        });
        showButton.addEventListener("click", e => {
            showButton.classList.add("disablePage");
            searchContainer.classList.remove("disablePage");
            document.documentElement.style.setProperty('--display','grid');
        })
        //Keyri show fallið einu sinni til þess að setja "off" clasan á allt sem er meira en minnsta verðið    
        initialize();
        show(minVerd,"",0,0); //Allt sem ég sendi með í þessa show() keyrslu eru default gildin en það er til þess að fá upphafsmyndina á síðuni.
        //þá byrtist aðeins ein mynd sem er myndin með lægsta verðið




                // Jónas R og Bandið
                //console.log(concertEvents[0].name);  
            });
            
    })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });