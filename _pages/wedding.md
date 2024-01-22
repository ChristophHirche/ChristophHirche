---
title: "Christoph and Jamies wedding"
layout: wedding
excerpt: "Christoph and Jamies wedding"
sitemap: false
permalink: /CJwedding/
---

# Christoph & Jamie's wedding
#### Saturday, 14. September 2024


<p style="margin-bottom:1cm;">
<img style="text-align: center;margin:0 10px 10px 0" src="{{ site.url }}{{ site.baseurl }}/images/savethedate.png"  width="500"> 
<br />
</p>



Please let us know by tomorrow if you can make it: 
## [RSVP](https://forms.gle/NpjWY5iNtojtxxXS8)

### Agenda
Details TBC

#### Morning session at [Glenmarie Hotel & Golf Resort](https://g.co/kgs/drnuFi8)
<p style="margin-bottom:1cm;">
<b>09:30</b> Full Gospel wedding  <br /> 

<b>11:00</b> Lunch <br />

<b>12:00</b> Tea ceremony <br />
</p>

#### Evening session at [Astor Ballroom, The St. Regis Kuala Lumpur](https://g.co/kgs/DaKYdCk)

<p style="margin-bottom:6cm;">
<b>18:00</b> Reception <br />

<b>19:00</b> Dinner <br />

</p>

#### Gallery
(Right-click *'view image'* to see a larger image.)
{% assign number_printed = 0 %}
{% for pic in site.data.pictures_wedding %}

{% assign even_odd = number_printed | modulo: 4 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-3 clearfix">
<img src="{{ site.url }}{{ site.baseurl }}/images/picpic/Gallery/{{ pic.image }}" class="img-responsive" width="95%" style="float: left" />
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd > 2 %}
</div>
{% endif %}


{% endfor %}

{% assign even_odd = number_printed | modulo: 4 %}
{% if even_odd == 1 %}
</div>
{% endif %}

{% if even_odd == 2 %}
</div>
{% endif %}

{% if even_odd == 3 %}
</div>
{% endif %}

<p> &nbsp; </p>





