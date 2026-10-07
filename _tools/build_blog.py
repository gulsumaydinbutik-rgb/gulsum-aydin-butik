#!/usr/bin/env python3
"""Blog sayfalarını, sitemap.xml ve robots.txt dosyasını üretir.
Kullanım (repo kökünden):  python3 _tools/build_blog.py
Yeni yazı eklemek için POSTS listesine bir kayıt ekleyip scripti tekrar çalıştırın."""
import os, json, html, datetime

SITE = "https://www.gulsumaydin.com.tr"
BRAND = "Gülsüm Aydın Butik"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# id -> (ürün adı, kısa not)  — Google Sheets'teki ürünlerle aynı id'ler
PRODUCTS = {
    "p1":  "Karışık Meyve Baskılı Oysho Sweat",
    "p2":  "Çizgili Sweat Oysho Pantolon Siyah",
    "p3":  "Katar Sandy Takım Lacivert",
    "p4":  "Basic Body Siyah",
    "p5":  "Oysho Şalvar Takım Bordo",
    "p6":  "Fermuarlı OYSHO Pantolonlu Takım Lacivert",
    "p7":  "Oval Kesim Oysho Takım",
    "p8":  "Çizgili Sweat Oysho Pantolon Kombin",
    "p10": "Baklava Desen Kazak",
    "p11": "Yarasa Kol Gömlek",
    "p12": "Fularlı Tesettür Gömlek",
    "p13": "Büzgülü Oysho Body Vual Etek Takım",
    "p14": "Basic Kazak Etek Kombin Takım",
    "p15": "Kemerli Kaşe Panço",
    "DP1001-210-GA": "Kadın Kalem Pantolon",
    "p16": "Kapşonlu Fermuarlı Triko Takım",
    "p17": "Kol Detaylı Oysho Sweat Scuba Etek Takım",
    "p18": "Kol Detaylı Oysho Sweat Scuba Puf Pantolon Takım",
}
# Kalem pantolonun görseli harici sitede olduğu için blogda kart görseli kullanılmaz
IMG = {k: "/assets/urunler/%s-1.jpg" % k for k in PRODUCTS if k != "DP1001-210-GA"}
IMG["DP1001-210-GA"] = None
# Sitemap'e girmeyecek ürünler (görseli olmayan / yayında olmayan)
SITEMAP_SKIP = {"p9"}

def pl(pid, text=None):
    """Ürüne metin içi bağlantı."""
    return '<a href="/?urun=%s">%s</a>' % (pid, html.escape(text or PRODUCTS[pid]))

def cards(ids):
    out = ['<div class="pcards">']
    for pid in ids:
        img = IMG.get(pid)
        out.append('<a class="pcard" href="/?urun=%s">' % pid +
                   ('<img src="%s" alt="%s" loading="lazy" width="400" height="500">' % (img, html.escape(PRODUCTS[pid])) if img else '<div class="noimg"></div>') +
                   '<span class="pn">%s</span><span class="pb">Ürünü İncele →</span></a>' % html.escape(PRODUCTS[pid]))
    out.append('</div>')
    return "".join(out)

POSTS = []

# ---------------------------------------------------------------- 1
POSTS.append(dict(
 slug="sonbahar-kis-tesettur-kombin-onerileri",
 title="Sonbahar-Kış Tesettür Kombin Önerileri: Şık ve Sıcak 7 Fikir",
 desc="Sonbahar ve kış için tesettür kombin önerileri: kazak-etek, triko takım, panço ve sweat takımlarla şık ve rahat görünmenin pratik yolları.",
 date="2026-10-07", cover="p14", read="5 dk",
 body=lambda: "".join([
 "<p>Hava soğumaya başlayınca dolap düzeni değişir. Amaç hem sıcak tutmak hem de şık görünmek olunca, tek tek parça aramak yerine birbiriyle uyumlu takımlardan yola çıkmak işi çok kolaylaştırır. Aşağıda sonbahar ve kış aylarında en sık işe yarayan yedi kombin fikrini topladık.</p>",
 "<h2>1. Kazak ve etek takımı: en kolay şıklık</h2>",
 "<p>Triko kazakla uyumlu bir eteği aynı renk ailesinden seçmek, “ne giysem” sorusunu bir hamlede çözer. Salaş kalıp kazak, belden oturan etekle dengelenir. Örneğin " + pl("p14") + " kazak ve puf etek ikilisini tek parça gibi taşımanızı sağlar; üzerine uzun bir palto ya da panço eklemek yeterlidir.</p>",
 "<h2>2. Triko takımla tek katta tamam</h2>",
 "<p>Sabah acele ettiğiniz günlerde fermuarlı, kapşonlu bir triko takım hem pratik hem sıcaktır. " + pl("p16") + " gibi bir takımı spor ayakkabıyla giyip günlük şıklığı yakalayabilir, düz ayakkabı ve şalla biraz daha toplu bir görünüm elde edebilirsiniz.</p>",
 "<h2>3. Sweat ve scuba etek ikilisi</h2>",
 "<p>Sweat üstlerin rahatlığını eteğin kadınsı duruşuyla birleştirmek istiyorsanız " + pl("p17") + " iyi bir başlangıçtır. Scuba kumaş etek formunu iyi korur; sweat ise günlük hareketi kısıtlamaz. Alt ve üstü aynı tonda tutarsanız boyunuzu da uzun gösterirsiniz.</p>",
 cards(["p14","p16","p17"]),
 "<h2>4. Kaşe panço ile katmanlama</h2>",
 "<p>Sonbaharın en çok işe yarayan parçalarından biri panço. " + pl("p15") + " gibi kemerli bir panço, altına giydiğiniz düz bir body ve pantolonla birlikte siluetinizi toparlar. Kemeri kullanmak bele vurgu yapar; kullanmadığınızda daha rahat bir duruş verir.</p>",
 "<h2>5. Desenli kazakta sade alt</h2>",
 "<p>Desenli bir kazak kombinin yıldızı olacaksa alt parçayı sade tutun. " + pl("p10") + " gibi dokulu bir kazakla düz renk pantolon ya da etek, gözü yormayan dengeli bir görünüm verir. Aksesuarı da en fazla bir noktada kullanmak yeterli.</p>",
 "<h2>6. Aynı ton, farklı doku kuralı</h2>",
 "<p>Kombin yaparken en güvenli yöntem “aynı tonda ama farklı dokuda” parçaları bir araya getirmektir. Örneğin bordo bir triko üstle bordo bir scuba alt, tek renk olsa da dokular farklı olduğu için sıkıcı durmaz. Kahve, haki, antrasit ve lacivert tonlarında bu yöntem özellikle iyi çalışır.</p>",
 "<h2>7. Şalvar takımla rahat ama şık</h2>",
 "<p>Salaş kalıpları sevenler için şalvar takımlar hem rahat hem de farklı bir seçenektir. " + pl("p5") + " gibi bir takımı sade bir şalla tamamladığınızda gün boyu rahat eder, akşam için de küçük bir aksesuarla toparlayabilirsiniz.</p>",
 cards(["p15","p10","p5"]),
 "<h2>Renk seçerken dikkat edilecekler</h2>",
 "<p>Sonbahar-kış ayları için kahve, haki, bordo, antrasit ve lacivert gibi toprak ve koyu tonlar hem mevsime uyar hem de birbirleriyle kolay kombinlenir. Ten rengine ve şalınıza göre bir ana renk seçip yanına bir nötr (siyah, bej, ekru) eklemek, dolabınızdaki parçaların birbirine uyum sağlamasını kolaylaştırır.</p>",
 "<h2>Kısaca</h2>",
 "<p>Takım düşünerek alışveriş yapmak, zamandan ve bütçeden tasarruf ettirir. Beden seçimi konusunda emin olamıyorsanız <a href=\"/blog/tesettur-takim-beden-ve-boy-secimi/\">beden ve boy seçimi rehberimize</a> göz atabilirsiniz. Tüm modellerimizi görmek için <a href=\"/\">ana sayfayı</a> ziyaret edin.</p>",
 ]),
 related=["oysho-takim-nasil-kombinlenir","tesettur-kumas-rehberi"],
))

# ---------------------------------------------------------------- 2
POSTS.append(dict(
 slug="oysho-takim-nasil-kombinlenir",
 title="Oysho Takım Nasıl Kombinlenir? Rahat Kalıp Takımlar İçin Rehber",
 desc="Oysho takım nedir, nasıl kombinlenir, hangi şal ve ayakkabıyla giyilir? Rahat kalıp sweat-pantolon takımları için pratik stil ve bakım ipuçları.",
 date="2026-10-07", cover="p7", read="5 dk",
 body=lambda: "".join([
 "<p>Tesettür giyimde “Oysho takım” denince akla genellikle rahat kalıplı, sweat tarzı üst ile pantolon ya da eteğin birlikte satıldığı takımlar gelir. Günlük hayatta rahat hareket etmek isteyenler için ideal olan bu takımlar, doğru kombinlendiğinde hiç de “evde giyilen” bir görüntü vermez. Bu yazıda işe yarayan yöntemleri bir araya getirdik.</p>",
 "<h2>Oysho takımı neden bu kadar tercih ediliyor?</h2>",
 "<ul><li><b>Rahatlık:</b> Salaş ve rahat kalıp, gün boyu hareket özgürlüğü sağlar.</li><li><b>Tek parça gibi görünüm:</b> Alt ve üst uyumlu geldiği için kombin düşünmenize gerek kalmaz.</li><li><b>Çok yönlülük:</b> Spor ayakkabıyla günlük, düz ayakkabıyla daha şık görünebilir.</li><li><b>Kolay bakım:</b> Çoğu model günlük kullanımda pratik bir kumaşa sahiptir; yine de yıkamadan önce etiketi kontrol edin.</li></ul>",
 "<h2>Kalıba göre nasıl giyilir?</h2>",
 "<p>Rahat kalıp takımlarda boyu ve duruşu kumaşın bolluğu belirler. Üst bol ise alt parçanın daha oturaklı olması dengeyi sağlar. " + pl("p7") + " oval kesimiyle tek başına dikkat çeker; sade bir şal ve düz bir ayakkabı yeterlidir.</p>",
 "<p>Fermuarlı modellerde (" + pl("p6") + ") fermuarı biraz aşağı çekmek yüz çevresini rahatlatır; tamamen kapatmak ise daha toplu bir görünüm verir.</p>",
 cards(["p7","p6","p2"]),
 "<h2>Çizgili modellerle boyu uzun gösterme</h2>",
 "<p>Dikey çizgiler boyu uzun gösterir. " + pl("p2") + " ve " + pl("p8") + " gibi çizgili sweat takımlarda çizgilerin pantolonla bütünleşmesi bacakları uzun gösterme etkisi yaratır. Üstü pantolonun içine atmak yerine dışarıda bırakmak ise daha rahat bir silüet verir.</p>",
 "<h2>Şal ve aksesuar seçimi</h2>",
 "<p>Oysho takımların sade doğası, şal seçimini kolaylaştırır. Takımın ana rengiyle aynı tonda ya da bir ton açığında düz bir şal, bütüncül bir görünüm sağlar. Desenli şalı ise takım sade ise tercih edin. Çanta ve ayakkabıyı tek renkte tutmak, günlük şıklığın en kolay yoludur.</p>",
 "<h2>Etek ve pantolon seçenekleri</h2>",
 "<p>Pantolonlu takımlar günlük koşturmaca için, etekli takımlar ise biraz daha kadınsı bir duruş için uygundur. Etekli seçenekleri merak ediyorsanız " + pl("p17") + " ile " + pl("p18") + " modellerine bakabilirsiniz; ikisinde de kol detayı sade takıma farklı bir dokunuş katıyor.</p>",
 cards(["p8","p17","p18"]),
 "<h2>Bakım ipuçları</h2>",
 "<ul><li>Yıkamadan önce ürün etiketindeki talimata uyun.</li><li>Koyu ve açık renkleri ayrı yıkayın.</li><li>Tersine çevirerek yıkamak baskı ve yüzey görünümünü korumaya yardımcı olur.</li><li>Kurutma makinesi yerine açık havada kurutmak formu korumaya yardımcı olur.</li></ul>",
 "<h2>Hangi bedeni seçmeli?</h2>",
 "<p>Salaş kalıpta genellikle kendi bedeninizi seçmek yeterlidir; daha bol bir duruş istiyorsanız bir beden büyük düşünebilirsiniz. Ürün sayfasındaki ölçüleri kendi en sevdiğiniz bir parçayla karşılaştırmak en güvenilir yöntemdir. Ayrıntılar için <a href=\"/blog/tesettur-takim-beden-ve-boy-secimi/\">beden ve boy rehberimize</a> bakabilirsiniz.</p>",
 ]),
 related=["sonbahar-kis-tesettur-kombin-onerileri","tesettur-takim-beden-ve-boy-secimi"],
))

# ---------------------------------------------------------------- 3
POSTS.append(dict(
 slug="tesettur-kumas-rehberi",
 title="Tesettür Giyimde Kumaş Rehberi: Scuba, Kaşe, Vual, Triko ve Krep",
 desc="Tesettür giyimde kumaş seçimi: scuba, kaşe, vual, triko, krep ve plise kumaşların özellikleri, hangi mevsimde ve nasıl giyileceği.",
 date="2026-10-07", cover="p13", read="6 dk",
 body=lambda: "".join([
 "<p>Bir parçanın nasıl durduğunu, ne kadar rahat ettireceğini ve nasıl bakım isteyeceğini büyük ölçüde kumaş belirler. Tesettür giyimde en sık karşılaşılan kumaşları, hangi durumda tercih edileceğiyle birlikte özetledik. Not: Aşağıdaki bilgiler genel özelliklerdir; her ürünün kumaş ve bakım bilgisi için ürün sayfasına ve etiketine bakın.</p>",
 "<h2>Scuba kumaş</h2>",
 "<p>Dolgun ve kalınca bir dokuya sahip olan scuba, formunu iyi korur ve genellikle kolay buruşmaz. Etek ve pantolonlarda sevilmesinin nedeni, vücuda yapışmadan düzgün bir duruş vermesidir. " + pl("p17") + " ve " + pl("p18") + " scuba alt parçalarıyla sweat üstü bir araya getiren örneklerdir.</p>",
 "<h2>Kaşe doku</h2>",
 "<p>Yumuşak tutuşlu, dolgun görünümlü kaşe doku, özellikle sonbahar ve kış parçalarında tercih edilir. " + pl("p15") + " kaşe dokusuyla panço kesimi birleştirerek hem rahat hem şık bir üst giyim sunar.</p>",
 cards(["p17","p18","p15"]),
 "<h2>Vual (voile)</h2>",
 "<p>İnce, hafif ve akışkan bir kumaş olan vual, ilkbahar ve yaz aylarının vazgeçilmezlerindendir. Hava aldığı için sıcakta rahat ettirir. " + pl("p13") + " vual body ile büzgülü etek takımı, hafif ve kadınsı bir seçenek arayanlar için uygundur.</p>",
 "<h2>Triko</h2>",
 "<p>Örgü yapısı sayesinde esneyen, yumuşak ve sıcak tutan triko, soğuk aylarda ilk akla gelen kumaş. " + pl("p16") + " ve " + pl("p10") + " triko tabanlı parçalardır. Triko ürünleri yıkarken düşük sıcaklık tercih etmek ve düz bir zeminde kurutmak formunu korumaya yardımcı olur.</p>",
 "<h2>Krep</h2>",
 "<p>Hafif akışkan ve dökümlü bir yapısı olan krep, özellikle klasik pantolonlarda sevilir. " + pl("DP1001-210-GA") + " gibi slim kalıp bir pantolon, üstte bol bir tunik ya da gömlekle iyi dengelenir.</p>",
 cards(["p13","p16","p10"]),
 "<h2>Plise ve gofre doku</h2>",
 "<p>Plise ve gofre gibi dokulu kumaşlar, düz bir yüzeye hareket katar. " + pl("p12") + " plise kumaşıyla, " + pl("p11") + " ise gofre dokusuyla bu etkiyi sunar. Dokulu üstlerde alt parçayı sade tutmak en doğrusu.</p>",
 "<h2>Mevsime göre kumaş seçimi</h2>",
 "<ul><li><b>İlkbahar-yaz:</b> vual, pamuklu ve ince dokulu kumaşlar</li><li><b>Sonbahar:</b> kaşe, ponte, ince triko</li><li><b>Kış:</b> kalın triko, scuba, sweat</li></ul>",
 "<h2>Kumaş bakımında genel kurallar</h2>",
 "<ul><li>Her zaman ürün etiketindeki yıkama talimatını esas alın.</li><li>Yeni bir parçayı ilk kez yıkarken koyu renklerden ayrı yıkayın.</li><li>Hassas kumaşlarda file torba kullanın.</li><li>Ütülerken kumaşa uygun ısıyı seçin.</li></ul>",
 "<p>Kombin fikirleri için <a href=\"/blog/sonbahar-kis-tesettur-kombin-onerileri/\">sonbahar-kış kombin önerilerimize</a> göz atabilirsiniz.</p>",
 ]),
 related=["sonbahar-kis-tesettur-kombin-onerileri","tesettur-gomlek-kombinleri"],
))

# ---------------------------------------------------------------- 4
POSTS.append(dict(
 slug="tesettur-gomlek-kombinleri",
 title="Tesettür Gömlek Kombinleri: Fularlı, Yarasa Kollu ve Plise Modeller",
 desc="Tesettür gömlek nasıl kombinlenir? Fularlı, yarasa kollu, plise ve gofre dokulu gömlekler için pantolon, etek ve aksesuar önerileri.",
 date="2026-10-07", cover="p12", read="4 dk",
 body=lambda: "".join([
 "<p>Gömlek, tesettür gardırobunun en çok yönlü parçalarından biri. İş, okul, günlük kullanım ya da özel bir davet; doğru alt parçayla her ortama uyar. İşte farklı gömlek modelleri için kombin fikirleri.</p>",
 "<h2>Fularlı gömlekler</h2>",
 "<p>Yakasındaki fular detayı, gömleğe hazır bir aksesuar katar. " + pl("p12") + " gibi fularlı bir gömlekle ek bir kolye ya da şal ihtiyacı azalır. Alt parça olarak düz bir kalem pantolon ya da düz etek seçerseniz detay kendini gösterir.</p>",
 "<h2>Yarasa kollu gömlekler</h2>",
 "<p>Bol ve rahat bir kesim sunan yarasa kol, kol bölgesinde ekstra hareket alanı sağlar. " + pl("p11") + " gofre dokusuyla birlikte rahat bir üst seçeneğidir. Bol üstleri slim kalıp alt parçalarla dengelemek en kolay kural.</p>",
 cards(["p12","p11","DP1001-210-GA"]),
 "<h2>Kalem pantolon ile klasik görünüm</h2>",
 "<p>Gömlek kombininin en klasik partneri kalem pantolondur. " + pl("DP1001-210-GA") + " slim kalıbıyla bol gömleklerle iyi bir denge kurar. Aynı renkte bir kemer, görünümü toplar.</p>",
 "<h2>Alta body, üste gömlek</h2>",
 "<p>Gömleğin altına ince bir body giymek hem boyun bölgesini kapatır hem de katmanlı bir görünüm verir. " + pl("p4") + " bu amaçla kullanılabilecek sade bir seçenektir; gömleğin renginden bir ton açık ya da koyu olması şık durur.</p>",
 "<h2>Renk ve desen dengesi</h2>",
 "<ul><li>Desenli gömlekte alt parça düz olmalı.</li><li>Açık renk gömleği koyu pantolonla dengeleyin.</li><li>Gömlek ve şalı aynı ton ailesinden seçin.</li><li>Bir kombinde en fazla bir dikkat çekici detay kullanın.</li></ul>",
 "<h2>Hangi ortamda ne giymeli?</h2>",
 "<p><b>İş/okul:</b> düz renk gömlek + kalem pantolon. <b>Günlük:</b> bol gömlek + rahat pantolon + spor ayakkabı. <b>Davet:</b> fularlı ya da plise gömlek + şık bir alt + sade aksesuar.</p>",
 "<p>Kumaşlar hakkında daha fazla bilgi için <a href=\"/blog/tesettur-kumas-rehberi/\">kumaş rehberimizi</a> okuyabilirsiniz.</p>",
 ]),
 related=["tesettur-kumas-rehberi","tesettur-takim-beden-ve-boy-secimi"],
))

# ---------------------------------------------------------------- 5
POSTS.append(dict(
 slug="tesettur-takim-beden-ve-boy-secimi",
 title="Tesettür Takım Beden ve Boy Nasıl Seçilir? Ölçü Rehberi",
 desc="Online tesettür alışverişinde doğru beden ve boy nasıl seçilir? Ürün ölçülerini okuma, S-M / L-XL bedenleri ve salaş kalıp için pratik ipuçları.",
 date="2026-10-07", cover="p3", read="4 dk",
 body=lambda: "".join([
 "<p>Online alışverişte en çok merak edilen konu bedenin uyup uymayacağı. İşin iyi tarafı, birkaç basit adımla doğru bedeni büyük oranda tahmin edebilirsiniz. Bu rehberde ürün sayfalarındaki ölçüleri nasıl okuyacağınızı ve beden seçerken nelere dikkat edeceğinizi anlatıyoruz.</p>",
 "<h2>Adım 1: Dolabınızdaki en sevdiğiniz parçayı ölçün</h2>",
 "<p>Size en iyi oturan bir üst ve bir pantolon ya da etek seçin, düz bir zemine koyup boyunu ölçün. Bu ölçüyü ürün sayfasındaki “ölçüler” kısmıyla karşılaştırın. Bu yöntem, genel beden tablolarından çok daha güvenilirdir.</p>",
 "<h2>Adım 2: Boy ölçülerini okumayı öğrenin</h2>",
 "<p>Ürün sayfalarında tunik, sweat, ceket gibi üst parçaların boyu (omuzdan etek ucuna), pantolon ve eteklerin ise bel hizasından alt ucuna boyu verilir. Örnekler:</p>",
 "<ul><li>" + pl("p3") + ": tunik boyu 85 cm</li><li>" + pl("p6") + ": tunik boyu 80 cm</li><li>" + pl("p2") + ": ceket boyu 75 cm, pantolon boyu 98 cm</li><li>" + pl("p8") + ": sweat boyu 70 cm, pantolon boyu 100 cm</li><li>" + pl("p17") + ": sweat boyu 80 cm, etek boyu 95 cm</li></ul>",
 cards(["p3","p6","p2"]),
 "<h2>Adım 3: Kalıbı anlayın</h2>",
 "<p>Ürün sayfalarında “salaş”, “rahat” ya da “slim” gibi kalıp bilgileri yer alır. Salaş ve rahat kalıplı parçalar vücuttan bol durur; kendi bedeninizi almanız genellikle yeterlidir. Slim kalıp ürünlerde ise vücuda daha oturan bir duruş vardır. " + pl("DP1001-210-GA") + " slim kalıp pantolona bir örnektir.</p>",
 "<h2>Adım 4: S-M, L-XL ve standart beden</h2>",
 "<p>Bazı modellerde bedenler tek tek (38, 40, 42…) verilir; bazılarında ise S-M ve L-XL gibi aralıklarla satılır. Salaş kalıp modellerde aralıklı beden sistemi daha kolay uyum sağlar. " + pl("p7") + " ve " + pl("p5") + " bu şekilde S-M ve L-XL seçenekleriyle sunulur. “Standart” bedenli ürünler (örneğin " + pl("p15") + ") ise bol kesim sayesinde birçok bedene uyum sağlar.</p>",
 cards(["p7","p5","p15"]),
 "<h2>Adım 5: Boyunuza göre uzunluk kontrolü</h2>",
 "<p>Boy kısa ya da uzunsa eteklerin ve pantolonların boyuna dikkat edin. Pantolon boyunu iç bacak ölçünüzle karşılaştırmak en doğrusudur. Etek boyu için ise dizinizden ne kadar aşağı inmesini istediğinizi belirleyin.</p>",
 "<h2>Kararsız kaldığınızda</h2>",
 "<ul><li>İki beden arasında kaldıysanız ve salaş bir görünüm istiyorsanız büyük bedeni seçin.</li><li>Slim kalıpta ise normalde giydiğiniz bedeni tercih edin.</li><li>Ürün sayfasındaki ölçüler hakkında sorunuz varsa WhatsApp’tan bize yazın, birlikte bakalım.</li><li>Cayma hakkınız ve iade koşullarımız için <a href=\"/?sayfa=iade-cayma-ve-degisim\">iade ve değişim sayfamıza</a> bakabilirsiniz.</li></ul>",
 "<p>Kombin fikirleri için <a href=\"/blog/oysho-takim-nasil-kombinlenir/\">Oysho takım kombin rehberimizi</a> okuyabilirsiniz.</p>",
 ]),
 related=["oysho-takim-nasil-kombinlenir","sonbahar-kis-tesettur-kombin-onerileri"],
))

# ================================================================ şablon
def head(title, desc, canonical, og_img, jsonld, og_type="article"):
    return """<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(t)s</title>
<meta name="description" content="%(d)s">
<link rel="canonical" href="%(c)s">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="google-site-verification" content="4Rq3erPpX-Aux230lMWbMU8Hn925onCOdNrWb2TgFjc" />
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="%(t)s">
<meta property="og:description" content="%(d)s">
<meta property="og:image" content="%(i)s">
<meta property="og:type" content="%(ot)s">
<meta property="og:url" content="%(c)s">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="%(b)s">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/blog.css">
<script type="application/ld+json">%(j)s</script>
</head>
<body>
""" % dict(t=html.escape(title), d=html.escape(desc), c=canonical, i=og_img, j=json.dumps(jsonld, ensure_ascii=False), b=BRAND, ot=og_type)

def top():
    return """<header class="bh"><div class="bh-in"><a class="brand" href="/">%s<small>Tesettür Giyim</small></a>
<nav><a href="/">Alışveriş</a><a href="/blog/">Blog</a></nav></div></header>
""" % BRAND

def foot():
    links = [("mesafeli-satis-sozlesmesi","Mesafeli Satış Sözleşmesi"),("kvkk-aydinlatma-metni","KVKK Aydınlatma Metni"),
             ("gizlilik-ve-cerez-politikasi","Gizlilik ve Çerez Politikası"),("iade-cayma-ve-degisim","İade, Cayma ve Değişim"),
             ("teslimat-ve-odeme","Teslimat ve Ödeme"),("hakkimizda","Hakkımızda & İletişim")]
    return """<footer class="bf"><div class="sf-brand">%s</div><div class="sf-links"><a href="/blog/">Blog</a>%s</div>
<div class="sf-copy">© %d %s · Tüm hakları saklıdır.<br>Kapıda ödeme · 14 gün içinde cayma hakkı</div></footer>
</body>
</html>
""" % (BRAND, "".join('<a href="/?sayfa=%s">%s</a>' % l for l in links), datetime.date.today().year, BRAND)

def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

def fmt_date(d):
    y, m, dd = d.split("-")
    ay = ["", "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"][int(m)]
    return "%d %s %s" % (int(dd), ay, y)

BY = {p["slug"]: p for p in POSTS}

for p in POSTS:
    url = "%s/blog/%s/" % (SITE, p["slug"])
    cover = SITE + IMG[p["cover"]]
    ld = [
      {"@context":"https://schema.org","@type":"BlogPosting","headline":p["title"],"description":p["desc"],
       "image":[cover],"datePublished":p["date"],"dateModified":p["date"],"inLanguage":"tr",
       "mainEntityOfPage":{"@type":"WebPage","@id":url},
       "author":{"@type":"Organization","name":BRAND,"url":SITE+"/"},
       "publisher":{"@type":"Organization","name":BRAND,"logo":{"@type":"ImageObject","url":SITE+"/icon-512.png"}}},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Ana Sayfa","item":SITE+"/"},
        {"@type":"ListItem","position":2,"name":"Blog","item":SITE+"/blog/"},
        {"@type":"ListItem","position":3,"name":p["title"],"item":url}]}]
    rel = "".join('<a class="rel" href="/blog/%s/"><span>%s</span></a>' % (s, html.escape(BY[s]["title"])) for s in p["related"])
    page = (head(p["title"] + " | " + BRAND, p["desc"], url, cover, ld) + top() +
      '<main class="art"><nav class="crumb" aria-label="Sayfa yolu"><a href="/">Ana Sayfa</a> › <a href="/blog/">Blog</a></nav>'
      '<h1>%s</h1><div class="meta"><time datetime="%s">%s</time> · %s okuma · %s</div>'
      '<img class="cover" src="%s" alt="%s" width="800" height="1000">'
      '%s'
      '<aside class="cta"><b>Modellerimizi inceleyin</b><p>Tüm ürünlerimizde kapıda ödeme ve 14 gün içinde cayma hakkı vardır.</p><a class="btn" href="/">Mağazaya Git</a></aside>'
      '<section class="relwrap"><h2>Bunları da okuyun</h2>%s</section></main>' % (
        html.escape(p["title"]), p["date"], fmt_date(p["date"]), p["read"], BRAND, IMG[p["cover"]], html.escape(PRODUCTS[p["cover"]]),
        p["body"](), rel) + foot())
    write("blog/%s/index.html" % p["slug"], page)

# blog dizini
lst = "".join(
  '<a class="post" href="/blog/%s/"><img src="%s" alt="%s" loading="lazy" width="400" height="500"><div><h2>%s</h2><p>%s</p><span>%s · %s okuma</span></div></a>' %
  (p["slug"], IMG[p["cover"]], html.escape(PRODUCTS[p["cover"]]), html.escape(p["title"]), html.escape(p["desc"]), fmt_date(p["date"]), p["read"])
  for p in POSTS)
idx_ld = [{"@context":"https://schema.org","@type":"Blog","name":BRAND+" Blog","url":SITE+"/blog/","inLanguage":"tr",
           "blogPost":[{"@type":"BlogPosting","headline":p["title"],"url":"%s/blog/%s/"%(SITE,p["slug"]),"datePublished":p["date"]} for p in POSTS]},
          {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"Ana Sayfa","item":SITE+"/"},
            {"@type":"ListItem","position":2,"name":"Blog","item":SITE+"/blog/"}]}]
write("blog/index.html", head("Blog — Tesettür Kombin, Kumaş ve Beden Rehberleri | " + BRAND,
  "Tesettür kombin önerileri, kumaş rehberi, beden ve boy seçimi: Gülsüm Aydın Butik blogunda pratik stil rehberleri.",
  SITE + "/blog/", SITE + IMG[POSTS[0]["cover"]], idx_ld, "website") + top() +
  '<main class="art"><nav class="crumb" aria-label="Sayfa yolu"><a href="/">Ana Sayfa</a> › Blog</nav><h1>Blog</h1>'
  '<p class="lead">Tesettür kombin önerileri, kumaş bilgileri ve beden seçimi rehberleri.</p><div class="posts">%s</div></main>' % lst + foot())

# sitemap + robots
today = datetime.date.today().isoformat()
urls = [(SITE + "/", "1.0", "daily"), (SITE + "/blog/", "0.8", "weekly")]
urls += [("%s/blog/%s/" % (SITE, p["slug"]), "0.8", "monthly") for p in POSTS]
urls += [("%s/?urun=%s" % (SITE, pid), "0.7", "weekly") for pid in PRODUCTS if pid not in SITEMAP_SKIP]
urls += [("%s/?kategori=%s" % (SITE, c), "0.6", "weekly") for c in ["Takım", "Üst Giyim", "Alt Giyim"]]
from urllib.parse import quote
def loc(u):
    base, _, q = u.partition("?")
    if q:
        k, _, v = q.partition("=")
        u = base + "?" + k + "=" + quote(v)
    return html.escape(u)
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
  "  <url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%s</priority></url>\n" % (loc(u), today, cf, pr) for u, pr, cf in urls) + "</urlset>\n"
write("sitemap.xml", sm)
write("robots.txt", "User-agent: *\nAllow: /\nDisallow: /admin.html\n\nSitemap: %s/sitemap.xml\n" % SITE)
print("OK", len(POSTS), "yazı,", len(urls), "sitemap URL")
