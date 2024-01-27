---
title: "Christoph and Jamies wedding"
layout: wedding
excerpt: "Christoph and Jamies wedding"
sitemap: false
permalink: /CJwedding/
---





<p style="margin-bottom:1cm;">
<img style="text-align: center;margin:0 10px 10px 0" src="{{ site.url }}{{ site.baseurl }}/images/savethedate.png"  width="100%"> 
<br />
</p>



We are so excited to have you! Please RSVP by 01. May 2024:  
## [RSVP](https://forms.gle/NpjWY5iNtojtxxXS8)

### Agenda

#### Morning session at [Glenmarie Hotel & Golf Resort](https://g.co/kgs/drnuFi8) (Free parking)
Dress code: Smart Casual
<p style="margin-bottom:1cm;">
<b>09:30</b> Full Gospel Wedding  <br /> 
<b>11:00</b> Lunch <br />
<b>12:00</b> Chinese Tea Ceremony <br />
</p>

#### Evening session at [Astor Ballroom, The St. Regis Kuala Lumpur](https://g.co/kgs/DaKYdCk)
Dress code: Formal
<p style="margin-bottom:6cm;">
<b>18:00</b> Reception (Drinks & Canapes) <br />
<b>19:00</b> Dinner <br />

</p>

#### Gallery
{% assign number_printed = 0 %}
{% for pic in site.data.pictures_wedding %}

{% assign even_odd = number_printed | modulo: 4 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-3 clearfix">
<img src="{{ site.url }}{{ site.baseurl }}/images/picpic/Gallery/{{ pic.image }}" class="img-responsive" width="90%" style="float: left" />
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





