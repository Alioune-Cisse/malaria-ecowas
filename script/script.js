//Carousel
  $(document).ready(function(){
    // Activate Carousel
    $("#myCarousel").carousel();
      
    // Enable Carousel Indicators
    $(".item1").click(function(){
      $("#myCarousel").carousel(0);
    });
    $(".item2").click(function(){
      $("#myCarousel").carousel(1);
    });
    $(".item3").click(function(){
      $("#myCarousel").carousel(2);
    });
    $(".item4").click(function(){
      $("#myCarousel").carousel(3);
    });
      
    // Enable Carousel Controls
    $(".left").click(function(){
      $("#myCarousel").carousel("prev");
    });
    $(".right").click(function(){
      $("#myCarousel").carousel("next");
    });
});
/*$(document).ready(function(){
    $("#click2").click(function(){
        $("#symptomes").css("display","block");
    });
})*/
  //-------------------------------------------------//


var width = 1000, height = 450;
var path = d3.geoPath();
var projection = d3.geoMercator().center([8, 14]).scale(1000).translate([width / 2, height / 2]);
path.projection(projection);

var svg = d3.select('#map').append("svg").attr("id", "svg").attr("width", width).attr("height", height);

var ecowas = svg.append("g");
var pays=svg.append("g");
//Dessiner la carte de la CEDEAO
d3.json('data/map.geojson').then(function(geojson) {
    ecowas.selectAll("g").data(geojson.features).enter().append('g').attr("class","gpath").attr("fill","black").attr("stroke", "white").attr("stroke-width", "0").append("path").attr("d", path).attr("class", "path")
//Evènement mouseenter à chaque pays
    d3.select("#svg").selectAll("g").on('mouseenter', function(d){
        d3.select(this).selectAll("g").on('mouseenter',function(d){
            d3.select(this).attr("fill", "rgba(255,255,255,0.9").attr("stroke","black").attr("stroke-width",1);
                d3.select("#pays").text(d.properties.name);
                d3.select("#popmoy").text(d.properties.pop_est+" habitants ("+d.properties.lastcensus+")")
                d3.select("#img").attr("src",function(){return  "images/"+d.properties.name+".jpg"});
                d3.select("#town").attr("src",function(){return  "images/"+d.properties.name+"1.jpg"});
        });
        d3.select(this).selectAll('g').on('click', function(d){
            d3.select(this).attr("href","exemple.html").attr("target","_blank").append("text").text("data")
            window.open(''+d.properties.name+'.html');
        });
        d3.select(this).selectAll("g").on("mouseleave", function(){
            d3.select(this).attr("fill", "black").attr("stroke","white").attr("stroke-width","0");
        });
    });
    //Evènement mouseleave
    d3.select("svg").select("g").on('mouseleave', function(){
        d3.select("#img").attr("src","images/ecowas.jpg");
        d3.select("#town").attr("src","images/cedeao.jpg");
        d3.select("#pays").text(" Ecowas");
        d3.select("#popmoy").text("340000000 habitants (2017)")
        /*d3.select(this).selectAll("g").on("mouseleave", function(){
            d3.select(this).attr("fill", "grey").attr("stroke","white").attr("stroke-width","0");
        });*/
    });      
});

var svg2=d3.select("#svg2").append("svg").attr("width","100%").attr("height","1200");
var margin = {top: 20, right: 20, bottom: 30, left: 100};
var x = d3.scaleBand().rangeRound([0, width]).padding(0.6),
y = d3.scaleLinear().rangeRound([height, 0]);
var x1 = d3.scaleBand().rangeRound([0, width]).padding(0.6),
y1 = d3.scaleLinear().rangeRound([1100, 600]);

var g = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var g1 = svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/pays.csv")
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Country=d.Country;

          return d;  
        });
    })
    .then((data) => {
        x.domain(data.map(function(d) { return d.Country; }));
        y.domain([0, d3.max(data, function(d) { return d.Deces; })]);
        x1.domain(data.map(function(d) { return d.Country; }));
        y1.domain([0, d3.max(data, function(d) { return d.Malades; })]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(20))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");

        g.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Country); })
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height",0)
            .attr("fill","white")
            .transition()
            .duration(5000)
            .attr("y", function(d) { return y(d.Deces); })
            .attr("height", function(d) { return height - y(d.Deces); })
            .attr("fill", "darkred");
        g.append("text").attr("x",200).attr("y",height+50).text("Evolution Nombre de décès causé par la Malaria en fonction des pays de la CEDEAO").attr("class","text");
        
        x1.domain(data.map(function(d) { return d.Country; }));
        y1.domain([0, d3.max(data, function(d) { return d.Malades; })]);

        g1.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + 1100 + ")")
            .call(d3.axisBottom(x1));

        g1.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y1).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Malades");

        g1.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x1(d.Country); })
            .attr("y", function(d) { return y1(d.Malades); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return 1100 - y1(d.Malades); })
            .attr("fill", "darkred")
            //.append("text").text(function(d){return d.Malades}).attr("x","20").attr("y",function(d){return 1100 - y1(d.Malades)}).attr("class","text");
        g1.append("text").attr("x",200).attr("y",1150).text("Evolution Nombre de cas détecté de la Malaria en fonction des pays de la CEDEAO").attr("class","text");

        
    })
    .catch((error) => {
            throw error;
    });

var svg3=d3.select("#svg3").append("svg").attr("width","100%").attr("height","1300");
var g2 = svg3.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var g3 = svg3.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/annees.csv")
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
        })
    .then((data)=>{
        //Linechart1
        var xScale = d3.scaleLinear().range([0,750]);
        var yScale = d3.scaleLinear().rangeRound([height, 0]);
        xScale.domain([2000,2017]);
        yScale.domain([0, d3.max(data, function(d) { return d.Deces; })]);

        var yaxis = d3.axisLeft().scale(yScale).ticks(10); 
        var xaxis = d3.axisBottom().scale(xScale).ticks(20);

        g2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xaxis);
           
        g2.append("g")
            .attr("class", "axis")
            .call(yaxis);

        var line = d3.line()
        .x(function(d) { return xScale(d.Annees); })
        .y(function(d) { return yScale(d.Deces); });

        /*var lines = g2.selectAll(".line")
        .data(data)
        .enter().append('line').attr("class","line");*/
       
        g2.append("path")
        .attr("d", function(d) { return line(data); })
        .attr("fill","none").attr("stroke","black").attr("stroke-width",1);
        g2.append("text").attr("x",50).attr("y",height+50).text("Evolution nombre de Décès causé par la Malaria de 2000 à 2017 dans l'espace CEDEAO").attr("class","text")

        /*------------------------------
        --------------------------------
        ---------------------------------*/

        var xScale1 = d3.scaleLinear().range([0,750]);
        var yScale1 = d3.scaleLinear().rangeRound([1000, 520]);
        xScale1.domain([2000,2017]);
        yScale1.domain([0, d3.max(data, function(d) { return d.Malades; })]);

        var yaxis1 = d3.axisLeft().scale(yScale1).ticks(10); 
        var xaxis1 = d3.axisBottom().scale(xScale1).ticks(20);

        g3.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + 1000 + ")")
            .call(xaxis1);
           
        g3.append("g")
            .attr("class", "axis")
            .call(yaxis1);

        var line1 = d3.line()
        .x(function(d) { return xScale1(d.Annees); })
        .y(function(d) { return yScale1(d.Malades); });

        /*var lines = g2.selectAll(".line")
        .data(data)
        .enter().append('line').attr("class","line");*/
       
        g3.append("path")
        .attr("d", function(d) { return line1(data); })
        .attr("fill","none").attr("stroke","black").attr("stroke-width",1);
        g3.append("text").attr("x",50).attr("y",1050).text("Evolution nombre de cas détecté de la Malaria de 2000 à 2017 dans l'espace CEDEAO").attr("class","text")

    })
    .catch((error) => {
            throw error;
    });
