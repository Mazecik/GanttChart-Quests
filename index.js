var dtname;
var dtdesc;


function clearSpace(arr) {
    for (var key in arr) {
        if (arr[key] == "") {
            arr.splice(key, 1)
            clearSpace(arr)
        }
    }
}
function quest(name, description, start, end) {
    this.name = name;
    this.description = description;
    this.start = start;
    this.end = end;
}

id = 0;
//  people
nowe1 = new quest('Kacper', 'urlop', new Date(2021, 6, 10), new Date(2021, 6, 11));
nowe2 = new quest('Przemek', 'urlop', new Date(2021, 6, 15), new Date(2021, 6, 18));
nowe3 = new quest('Mateusz', 'urlop', new Date(2021, 6, 10), new Date(2021, 6, 13));
nowe4 = new quest('Paweł', 'urlop', new Date(2021, 7, 14), new Date(2021, 7, 26));
//  Array of people
var everyone = [nowe1, nowe2, nowe3, nowe4];

// google charts
google.charts.load('current', {
    'packages': ['timeline'],
    'language': 'pl'
});
google.charts.setOnLoadCallback(drawChart);

// creating timeline
function drawChart() {
    var container = document.getElementById('timeline-chart');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({
        type: 'string',
        id: 'Name'
    });
    dataTable.addColumn({
        type: 'string',
        id: 'Description'
    });
    dataTable.addColumn({
        type: 'date',
        id: 'Start'
    });
    dataTable.addColumn({
        type: 'date',
        id: 'End'
    });
    // Adding everyone to timeline

    jQuery.each(everyone, function(){
        dataTable.addRows([
            [everyone[id].name, everyone[id].description, everyone[id].start, everyone[id].end]
        ]);
        id++;
    });
    // timeline options
    var options = {
        height: 700,

        timeline: {
            showRowLabels: true
        },
        timeline: {
            showBarLabels: false
        }
    };

    // Action listner for labels
    google.visualization.events.addListener(chart, 'select', function click() {
        var selection = chart.getSelection();
        if (selection.length > 0) {
            dtname = (dataTable.getValue(selection[0].row, 0));
            dtdesc = (dataTable.getValue(selection[0].row, 1));
            dtstart = (dataTable.getValue(selection[0].row, 2));
            dtend = (dataTable.getValue(selection[0].row, 3));
        }
        open_edit_options(dtname, dtdesc, dtstart, dtend);
    });
    
    // Action listner for rows
    google.visualization.events.addListener(chart, 'ready', function() {
        var rowLabels = container.getElementsByTagName('text');
        Array.prototype.forEach.call(rowLabels, function(label) {
            if (label.getAttribute('text-anchor') === 'end') {
                label.addEventListener('click', displayDetails, false);
            }
        });
    });

    function displayDetails(sender) {
        open_add_options(sender.target.innerHTML);
    }
    if(everyone.length<=0){
        showError("NIE MAM DANYCH!");
 
    }
    else{chart.draw(dataTable, options);}
}

// New Person

    function new_person() {
    var isGood = true;
    var name = $("#input_id").val();
    var description = $("#input_desc").val();    
    var start_date = $("#start_date").val();
    var end_date = $("#end_date").val();
    var errors = " ";
    
    if (name.length<=0 || name.length>18)
        {
            isGood=false;
            errors = errors + "</br> Długość nazwy(0-18 znaków)"
        }
    if (description.length<=0 || description.length>16)
        {
            isGood=false;
            errors = errors + "</br> Długość opisu(0-16 znaków)"
        }
    
    if(!isNaN(end_date)==true || !isNaN(start_date)==true)
    {
        isGood=false;
        errors = errors + "</br> Daty nie mogą być puste!"
    }else{
        if(start_date>end_date)
            {
                isGood=false;
                errors = errors + "</br> Rozpoczęcie musi być szybciej niż zakończenie"
            }
    }
        
    if(isGood==true)
        {
            errors = " ";
            start_date = new Date(start_date);
            start_date.setHours(start_date.getHours() - 2 );
            end_date = new Date(end_date);
            end_date.setHours(end_date.getHours() - 2 ); 
            id = 0;
            newadded = new quest(name, description, start_date, end_date);
            everyone[everyone.length] = newadded;
            showError(errors);
            drawChart();
        }
        showError(errors);
    
}





// Function after click at row
var check = 0;
function open_add_options(dtname) {
    $("#btn3").val("Dodaj zadanie dla " + dtname);
    $("#dtid").val(dtname);
    $("#btn9").attr("value", ("nowe zadanie dla " + dtname));
    $("#input_desc_for").placeholder = ("Opis zadania dla " + dtname);
//    hide/show options for Rows
    
    if (check != dtname) {

        show_new_quest();
        check = dtname;

    } else {
        hide_new_quest();
        check = 0;
    }

}

// Function after click at label
function open_edit_options(dtname, dtdesc, dtstart, dtend) {
    dtstart = formatDate(dtstart);
    dtend = formatDate(dtend);
    $("#edit_desc").attr("placeholder", (dtname + " " + dtdesc));
    $("#btn4").attr("value", ("Edytuj " + dtdesc + " dla " + dtname));
    $("#btn5").attr("value", ("Usuń " + dtdesc + " dla " + dtname));
    document.getElementById("edit_start_date").value = dtstart;
    document.getElementById("edit_end_date").value = dtend;
    $("#qdtid").attr("value", dtname);
    $("#qdtdesc").attr("value", dtdesc);
    $("#qdtstart").attr("value", dtstart);
    $("#qdtend").attr("value", dtend);
    $("#btn8").attr("value", ("Edytuj "+dtdesc + " dla " + dtname));
    
    // hiding Options for Labels 
    show_edit_zad();
}
// Close Option




// Validate New Quest
function new_quest() {
    var isGood = true;
    var dtname = $("#dtid").val();
    var errors;
    var description = $("#input_desc_for").val();
    var start_date = $("#start_date_for").val();
    var end_date = $("#end_date_for").val();
    var nazwa = dtname;
    errors=" ";

    // Validate Date
    if (end_date < start_date) {
        isGood = false;
        errors = errors + ("</br> Rozpoczęcie musi być szybciej niż zakończenie");
    }
    if ((!isNaN(end_date) == true) || (!isNaN(start_date) == true)) {
        isGood = false;
        errors = errors + ("</br> Ustaw datę rozpoczęcia i zakończenia");
    }

    if (isGood == true) {
        start_date = new Date(start_date);
        start_date.setHours(start_date.getHours() - 2 );
        end_date = new Date(end_date);
        end_date.setHours(end_date.getHours() - 2 );
        
        errors = " ";
        id = 0;
        newadded = new quest(nazwa, description, start_date, end_date);
        everyone[everyone.length] = newadded;
        showError(errors);
        drawChart();
        
    }
    showError(errors);
}

// Delete Quest

function delete_quest() {

    var description = $("#edit_desc").val();
    var start_date = $("#edit_start_date").val();
    var end_date = $("#edit_end_date").val();
    var nazwa = $("#qdtid").val();
    var olddesc = $("#qdtdesc").val();
    var oldstart = $("#qdtstart").val();
    var oldend = $("#qdtend").val();

    
    oldstart = new Date(oldstart);
    oldend = new Date(oldend);
    end_date = new Date(end_date);
    start_date = new Date(start_date);
    
    start_date.setHours( start_date.getHours() - 2 );
    end_date.setHours( end_date.getHours() - 2 );
    oldstart.setHours( oldstart.getHours() - 2 );
    oldend.setHours( oldend.getHours() - 2 );


    var i = 0;
    

    while (i < everyone.length) {

        if ((everyone[i].name == nazwa) && 
            (everyone[i].description == olddesc) &&
            ((everyone[i].start).getTime() == oldstart.getTime()) && 
            ((everyone[i].end).getTime() == oldend.getTime())){
            delete everyone[i];
            
            hide_edit_zad();
            hide_btn8();
        }

        i++;
    }

    everyone = everyone.filter(function(element) {
        return element !== undefined;
    });

    
    id = 0;
    drawChart();
}

// Edit Quest

function edit_quest() {

    var description = $("#edit_desc").val();
    var start_date = $("#edit_start_date").val();
    var end_date = $("#edit_end_date").val();
    var nazwa = $("#qdtid").val();
    var olddesc = $("#qdtdesc").val();
    var oldstart = $("#qdtstart").val();
    var oldend = $("#qdtend").val();
    var errors=" ";

    oldstart = new Date(oldstart);
    oldend = new Date(oldend);
    end_date = new Date(end_date);
    start_date = new Date(start_date);
    
    start_date.setHours( start_date.getHours() - 2 );
    end_date.setHours( end_date.getHours() - 2 );
    oldstart.setHours( oldstart.getHours() - 2 );
    oldend.setHours( oldend.getHours() - 2 );
    var isGood = false;
    var k = 0;
    var i = 0;

    while (i < everyone.length) {        
        if ((everyone[i].name == nazwa) && 
            (everyone[i].description == olddesc) &&
            ((everyone[i].start).getTime() == oldstart.getTime()) && 
            ((everyone[i].end).getTime() == oldend.getTime())) {
            isGood = true;
            k = i;
            
        }
        
        i++;
    }


if (isGood==true)
    
    {
// Check what is set to edit
    if (!isNaN(description) == false) {
        if(description.length<=16)
            {
        everyone[k].description = description;
            }else{
                errors = errors + (" za długi opis!");
            }

    }
    
    if((!isNaN(start_date) == true)&& (!isNaN(end_date) == true))
        {
            if(start_date<end_date)
                {
                    everyone[k].start = start_date;
                    everyone[k].end = end_date;
                }else{
                errors = errors + ("</br> rozpoczęcie musi być szybciej niż zakończenie");
            }
            
        }else{
    
    
    if (!isNaN(start_date) == true) {
        if (start_date < everyone[k].end) {

            everyone[k].start = start_date;
        }else{
                errors = errors + ("</br> rozpoczęcie musi być szybciej niż zakończenie");
            }

    }
    if (!isNaN(end_date) == true) {
        if (end_date > everyone[k].start) {
            everyone[k].end = end_date;
        }else{
                errors = errors + ("</br> rozpoczęcie musi być szybciej niż zakończenie");
            }

    }
}
    isGood=false;
    id = 0;
    show_edit_zad();
    drawChart();
}
    showError(errors);
    }
var ez=0;
var nq=0;
function show_edit_zad(){
    $("#edit_zad").css("display","block");
    hide_btn8();
    close_new_person();
    ez=1;
    if(nq==1){hide_new_quest();}
    
    
    
}
function hide_edit_zad(){
    $("#edit_zad").css("display","none");
    show_btn8();
}

function show_new_quest(){
    $("#edit").css("display", "block");
    hide_btn9();
    close_new_person();
    nq=1;
    if(ez==1){hide_edit_zad();}
    

}
function hide_new_quest(){
    $("#edit").css("display", "none");
    show_btn9();
}


function show_new_person(){
    $("#btn1").css("display","none");
    $("#pierwsze").css("display","block");
    if(nq==1){hide_new_quest();}
    if(ez==1){hide_edit_zad();}
}
function close_new_person(){
    $("#btn1").css("display","block");
    $("#pierwsze").css("display","none");
}
function show_btn8(){
    $("#btn8").css("display","block");
}
function hide_btn8(){
    $("#btn8").css("display","none");
}
function show_btn9(){
    $("#btn9").css("display","block");
}
function hide_btn9(){
    $("#btn9").css("display","none");
    
}



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function showError(errors){
    $("#errors").html(errors);
    
}