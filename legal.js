/* Yasal sayfalar — Gülsüm Aydın Butik
   Satıcı bilgilerini aşağıdaki LEGAL_INFO içinde doldurun; boş bırakılan satırlar sayfada görünmez. */
window.LEGAL_INFO = {
  marka: "Gülsüm Aydın Butik",
  site: "www.gulsumaydin.com.tr",
  unvan: "",          // Örn: "Gülsüm Aydın" (şahıs) veya şirket unvanı
  vergiDairesi: "",   // Örn: "Kadıköy"
  vergiNo: "",        // Vergi kimlik numarası / T.C. kimlik (şahıs ise vergi no)
  mersis: "",         // Varsa MERSİS no
  adres: "",          // Açık adres
  eposta: "",         // İletişim e-postası
  telefon: "0850 840 61 28",
  whatsapp: "0850 840 61 28",
  instagram: "@gulsumaydinbutik"
};

(function(){
  var I = window.LEGAL_INFO;
  function row(label, val){ return val ? '<tr><td>' + label + '</td><td>' + val + '</td></tr>' : ''; }
  function seller(){
    return '<table class="lg-tbl">' +
      row('Marka', I.marka) + row('Unvan', I.unvan) + row('Web sitesi', I.site) +
      row('Adres', I.adres) + row('Vergi Dairesi / No', (I.vergiDairesi || I.vergiNo) ? (I.vergiDairesi + ' / ' + I.vergiNo) : '') +
      row('MERSİS No', I.mersis) + row('Telefon', I.telefon) + row('WhatsApp', I.whatsapp) +
      row('E-posta', I.eposta) + row('Instagram', I.instagram) + '</table>';
  }
  function contactLine(){
    var parts = [];
    if (I.telefon) parts.push('Telefon/WhatsApp: ' + I.telefon);
    if (I.eposta) parts.push('E-posta: ' + I.eposta);
    return parts.join(' · ');
  }

  var P = {};

  P["hakkimizda"] = { title: "Hakkımızda & İletişim", html:
    '<p><b>' + I.marka + '</b>, kadınlara yönelik şık ve rahat tesettür giyim ürünleri sunan bir butiktir. ' +
    'Ürünlerimizi ' + I.site + ' adresinden online olarak satışa sunuyoruz.</p>' +
    '<h3>Satıcı Bilgileri</h3>' + seller() +
    '<h3>Bize Ulaşın</h3><p>Sipariş, ürün, iade ve değişim konularında WhatsApp veya telefon ile bize ulaşabilirsiniz. ' + contactLine() + '</p>' };

  P["mesafeli-satis-sozlesmesi"] = { title: "Mesafeli Satış Sözleşmesi", html:
    '<h3>Madde 1 – Taraflar</h3>' +
    '<p><b>SATICI</b></p>' + seller() +
    '<p><b>ALICI</b>: Sitede sipariş oluştururken ad, soyad, telefon, adres ve (varsa) e-posta bilgilerini paylaşan kişidir. Alıcının sipariş sırasında girdiği bilgiler esas alınır.</p>' +
    '<h3>Madde 2 – Konu</h3>' +
    '<p>İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait ' + I.site + ' internet sitesinden elektronik ortamda sipariş verdiği, sitede nitelikleri ve satış bedeli belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>' +
    '<h3>Madde 3 – Sözleşme Konusu Ürün ve Bedel</h3>' +
    '<p>Ürünün cinsi, adedi, rengi, bedeni, KDV dâhil satış fiyatı ve kargo bedeli, sipariş özetinde ve sipariş onay mesajında yer alır. Sitede ilan edilen fiyatlar ve kampanyalar, ilan edilen süre boyunca geçerlidir. Fiyat veya stok hatası tespit edilmesi halinde SATICI, ALICI’yı bilgilendirerek siparişi iptal etme hakkını saklı tutar.</p>' +
    '<h3>Madde 4 – Ödeme</h3>' +
    '<p>Sitede ödeme yöntemi <b>kapıda ödeme</b> olarak sunulmaktadır. ALICI, ürün bedelini teslimat sırasında kargo görevlisine öder. Kargo ücreti, sitede belirtilen şekilde (şu an tüm siparişlerde ücretsiz) uygulanır.</p>' +
    '<h3>Madde 5 – Teslimat</h3>' +
    '<p>Ürün, ALICI’nın sipariş sırasında bildirdiği teslimat adresine anlaşmalı kargo firması aracılığıyla gönderilir. Sipariş en kısa sürede kargoya verilir; her hâlükârda yasal azami teslim süresi olan 30 gün içinde teslim edilir. ALICI, teslimat sırasında paketi kontrol etmeli; hasarlı veya açılmış bir paket varsa kargo görevlisine tutanak tutturmalıdır.</p>' +
    '<h3>Madde 6 – Cayma Hakkı</h3>' +
    '<p>ALICI, ürünün kendisine veya gösterdiği adresteki kişiye teslim tarihinden itibaren <b>14 gün</b> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma bildirimi, bu süre içinde SATICI’ya yazılı olarak (WhatsApp, e-posta vb.) iletilir. Ürün, kullanılmamış, yıpratılmamış ve ambalajı/etiketleri bozulmamış olarak iade edilmelidir. Ayrıntılar “İade, Cayma ve Değişim” sayfasındadır.</p>' +
    '<p>Mesafeli Sözleşmeler Yönetmeliği’nde sayılan cayma hakkının kullanılamayacağı haller (ör. ALICI’nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan, kişiye özel ürünler; hijyen nedeniyle ambalajı açılmış ve iadesi sağlık/hijyen açısından uygun olmayan ürünler) saklıdır.</p>' +
    '<h3>Madde 7 – İade Bedelinin Ödenmesi</h3>' +
    '<p>Cayma bildiriminin ve iade edilen ürünün SATICI’ya ulaşmasının ardından, ürün bedeli en geç 14 gün içinde ALICI’ya iade edilir. Ödeme kapıda yapıldığı için iade, ALICI’nın bildireceği banka hesabına havale/EFT ile gerçekleştirilir.</p>' +
    '<h3>Madde 8 – ALICI’nın Yükümlülükleri</h3>' +
    '<p>ALICI, sipariş sırasında verdiği bilgilerin doğru ve eksiksiz olduğunu, ürünün özelliklerini ve satış koşullarını okuyup bilgi sahibi olduğunu ve elektronik ortamda onayladığını kabul eder. Ulaşılamayan veya yanlış adres nedeniyle teslim edilemeyen siparişlerden SATICI sorumlu değildir.</p>' +
    '<h3>Madde 9 – Ayıplı Mal</h3>' +
    '<p>Ayıplı ürün hâlinde ALICI, 6502 sayılı Kanun’un 11. maddesinde belirtilen seçimlik haklara (sözleşmeden dönme, bedel indirimi, ücretsiz onarım veya ayıpsız misli ile değişim) sahiptir. Bu hakların kullanımı için teslim tarihinden itibaren Kanun’da öngörülen süreler içinde SATICI’ya başvurulmalıdır.</p>' +
    '<h3>Madde 10 – Mücbir Sebep</h3>' +
    '<p>Tarafların kontrolü dışındaki, doğal afet, savaş, grev, kargo/ulaşım aksamaları gibi mücbir sebepler nedeniyle yükümlülüklerin yerine getirilememesi hâlinde taraflar sorumlu tutulamaz.</p>' +
    '<h3>Madde 11 – Uyuşmazlıkların Çözümü</h3>' +
    '<p>İşbu sözleşmeden doğan uyuşmazlıklarda, her yıl Ticaret Bakanlığı tarafından ilan edilen parasal sınırlar dâhilinde ALICI’nın veya SATICI’nın yerleşim yerindeki <b>Tüketici Hakem Heyetleri</b>, bu sınırları aşan durumlarda <b>Tüketici Mahkemeleri</b> yetkilidir.</p>' +
    '<h3>Madde 12 – Yürürlük</h3>' +
    '<p>ALICI, sipariş sırasında işbu sözleşmeyi ve Ön Bilgilendirme Formu’nu elektronik ortamda okuyup kabul ettiğini beyan eder. Sözleşme, siparişin onaylanması ile yürürlüğe girer.</p>' };

  P["on-bilgilendirme-formu"] = { title: "Ön Bilgilendirme Formu", html:
    '<p>Bu form, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, sipariş verilmeden önce ALICI’ya sunulan ön bilgilendirmedir.</p>' +
    '<h3>1. Satıcı</h3>' + seller() +
    '<h3>2. Ürünün Temel Nitelikleri</h3>' +
    '<p>Ürünün adı, rengi, bedeni, kumaş ve ölçü bilgileri, ilgili ürün sayfasında yer almaktadır. Ürün fotoğraflarındaki renkler, ekran ayarlarına göre küçük farklılıklar gösterebilir.</p>' +
    '<h3>3. Fiyat ve Ödeme</h3>' +
    '<p>Tüm fiyatlar KDV dâhil Türk Lirası’dır. Ödeme, kapıda ödeme yöntemiyle teslimat sırasında yapılır. Kargo bedeli sipariş özetinde gösterilir (şu an ücretsiz).</p>' +
    '<h3>4. Teslimat</h3>' +
    '<p>Ürün, ALICI’nın belirttiği adrese anlaşmalı kargo ile gönderilir. Teslimat süresi yasal azami süre olan 30 günü aşmaz.</p>' +
    '<h3>5. Cayma Hakkı</h3>' +
    '<p>ALICI, teslim tarihinden itibaren 14 gün içinde gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma hakkının kullanımına ilişkin usul ve örnek form “İade, Cayma ve Değişim” sayfasında yer alır. Cayma hakkının kullanılamayacağı haller Yönetmelik’te sayılan istisnalarla sınırlıdır.</p>' +
    '<h3>6. Şikâyet ve Uyuşmazlık</h3>' +
    '<p>Şikâyetlerinizi öncelikle bize iletebilirsiniz. Çözüm sağlanamazsa, ilan edilen parasal sınırlar dâhilinde Tüketici Hakem Heyetleri’ne veya Tüketici Mahkemeleri’ne başvurabilirsiniz.</p>' +
    '<p>ALICI, sipariş vermeden önce işbu ön bilgileri okuyup anladığını ve elektronik ortamda teyit ettiğini kabul eder.</p>' };

  P["kvkk-aydinlatma-metni"] = { title: "KVKK Aydınlatma Metni", html:
    '<p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) m.10 uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla aşağıda açıklanan kapsamda işlenmektedir.</p>' +
    '<h3>1. Veri Sorumlusu</h3>' + seller() +
    '<h3>2. İşlenen Kişisel Veriler</h3>' +
    '<ul><li><b>Kimlik:</b> ad, soyad</li><li><b>İletişim:</b> telefon numarası, e-posta (varsa)</li>' +
    '<li><b>Adres:</b> il, ilçe, mahalle, açık adres, posta kodu</li>' +
    '<li><b>Müşteri işlemi:</b> sipariş içeriği, tutar, sipariş notu, sipariş tarihi/numarası</li>' +
    '<li><b>İşlem güvenliği ve pazarlama:</b> IP adresi, cihaz/tarayıcı bilgisi, çerezler ve benzeri teknolojilerle elde edilen site kullanım verileri</li></ul>' +
    '<h3>3. İşleme Amaçları</h3>' +
    '<ul><li>Siparişin alınması, hazırlanması, kargolanması ve teslimi</li><li>Sipariş onayı ve bilgilendirme iletilerinin gönderilmesi</li>' +
    '<li>İade, değişim ve müşteri destek süreçlerinin yürütülmesi</li><li>Yasal yükümlülüklerin (fatura, muhasebe, vergi, tüketici mevzuatı) yerine getirilmesi</li>' +
    '<li>Site performansının ölçülmesi, güvenliğin sağlanması, reklam ve tanıtım faaliyetlerinin yürütülmesi (çerez izniniz doğrultusunda)</li></ul>' +
    '<h3>4. Hukuki Sebepler</h3>' +
    '<p>Verileriniz KVKK m.5/2 uyarınca; sözleşmenin kurulması ve ifasıyla doğrudan ilgili olması (m.5/2-c), hukuki yükümlülüğün yerine getirilmesi (m.5/2-ç), meşru menfaat (m.5/2-f) ve açık rızanız (m.5) hukuki sebeplerine dayanılarak işlenir.</p>' +
    '<h3>5. Verilerin Aktarılması</h3>' +
    '<p>Verileriniz; siparişin teslimi için anlaşmalı kargo firmalarına, sipariş ve ürün kayıtlarının tutulması ve e-posta bildirimleri için kullanılan bulut hizmet sağlayıcılarına (Google altyapısı), site kullanım ölçümü ve reklam hizmetleri için analitik/reklam sağlayıcılarına (Google, Meta) ve yasal olarak yetkili kamu kurum ve kuruluşlarına aktarılabilir. Bu hizmet sağlayıcıların sunucuları yurt dışında bulunabilir; aktarımlar KVKK m.8 ve m.9 hükümlerine uygun olarak yapılır.</p>' +
    '<h3>6. Toplama Yöntemi</h3>' +
    '<p>Verileriniz, sitedeki sipariş formu, WhatsApp/telefon iletişimi ve çerezler aracılığıyla elektronik ortamda toplanır.</p>' +
    '<h3>7. Haklarınız (KVKK m.11)</h3>' +
    '<p>Veri sahibi olarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme, yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin otomatik sistemlerle analizi sonucu aleyhinize bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.</p>' +
    '<h3>8. Başvuru</h3>' +
    '<p>Haklarınıza ilişkin taleplerinizi, kimliğinizi tespit edici bilgilerle birlikte yukarıdaki iletişim bilgilerimiz üzerinden bize iletebilirsiniz. Talebiniz niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. Ayrıca Kişisel Verileri Koruma Kurumu’na şikâyet hakkınız saklıdır.</p>' };

  P["gizlilik-ve-cerez-politikasi"] = { title: "Gizlilik ve Çerez Politikası", html:
    '<h3>Gizlilik</h3>' +
    '<p>' + I.marka + ' olarak ziyaretçilerimizin ve müşterilerimizin gizliliğine saygı duyuyoruz. Siteyi kullanırken paylaştığınız bilgiler yalnızca siparişinizi gerçekleştirmek, sizinle iletişim kurmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla, <b>KVKK Aydınlatma Metni</b>’nde açıklanan kapsamda işlenir. Bilgileriniz üçüncü kişilere satılmaz.</p>' +
    '<p>Sitede kredi/banka kartı bilgisi alınmaz; ödeme kapıda yapılır.</p>' +
    '<h3>Çerezler ve Benzeri Teknolojiler</h3>' +
    '<p>Çerez, ziyaret ettiğiniz sitenin tarayıcınıza kaydettiği küçük veri dosyasıdır. Sitemizde ve tarayıcı yerel depolamasında şu amaçlarla veri tutulur:</p>' +
    '<ul><li><b>Zorunlu / işlevsel:</b> sepetinizin, favorilerinizin ve sipariş formu taslağınızın tarayıcınızda saklanması.</li>' +
    '<li><b>Analitik:</b> Google Analytics gibi araçlarla ziyaret ve sayfa kullanımının anonim olarak ölçülmesi (etkinleştirildiğinde).</li>' +
    '<li><b>Reklam / pazarlama:</b> Meta (Facebook/Instagram) Pikseli aracılığıyla sayfa görüntüleme, sepete ekleme ve satın alma olaylarının ölçülmesi ve reklamların etkinliğinin değerlendirilmesi.</li></ul>' +
    '<h3>Çerezleri Yönetme</h3>' +
    '<p>Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Çerezleri engellemeniz hâlinde sitenin bazı özellikleri (ör. sepetin hatırlanması) düzgün çalışmayabilir. Meta reklam tercihlerinizi Meta hesabınızın reklam ayarlarından yönetebilirsiniz.</p>' +
    '<h3>İletişim</h3><p>Gizlilik ve çerezlerle ilgili sorularınız için: ' + contactLine() + '</p>' };

  P["iade-cayma-ve-degisim"] = { title: "İade, Cayma ve Değişim", html:
    '<h3>Cayma Hakkı (14 Gün)</h3>' +
    '<p>Ürünü teslim aldığınız tarihten itibaren <b>14 gün</b> içinde, herhangi bir gerekçe göstermeden cayma hakkınızı kullanarak iade edebilirsiniz.</p>' +
    '<h3>İade Koşulları</h3>' +
    '<ul><li>Ürün kullanılmamış, yıkanmamış, yıpratılmamış olmalıdır.</li><li>Etiketleri ve ambalajı bozulmamış olmalıdır.</li><li>Ürün, tüm aksesuarlarıyla (varsa) birlikte eksiksiz gönderilmelidir.</li></ul>' +
    '<h3>İade Nasıl Yapılır?</h3>' +
    '<ol><li>14 gün içinde WhatsApp/telefon' + (I.eposta ? ' veya e-posta' : '') + ' ile sipariş numaranızı belirterek iade talebinizi bize iletin.</li>' +
    '<li>Size iade kargo bilgisini ileteceğiz; ürünü orijinal ambalajıyla gönderin.</li>' +
    '<li>Ürün bize ulaşıp kontrol edildikten sonra ürün bedeli en geç 14 gün içinde, bildireceğiniz banka hesabına havale/EFT ile iade edilir.</li></ol>' +
    '<h3>Değişim</h3>' +
    '<p>Beden veya renk değişimi için aynı süre içinde bize ulaşın. Stok durumuna göre değişim yapılır; stok yoksa iade seçeneği sunulur.</p>' +
    '<h3>Hasarlı veya Hatalı Ürün</h3>' +
    '<p>Hasarlı, ayıplı veya yanlış gönderilmiş ürün tespit ederseniz, kargoyu teslim alırken tutanak tutturun ve en kısa sürede fotoğraflarla birlikte bize bildirin. Ayıplı ürün hâlinde yasal haklarınız saklıdır.</p>' +
    '<h3>İade Edilemeyecek Ürünler</h3>' +
    '<p>Mevzuatın izin verdiği istisnalar (kişiye özel hazırlanan ürünler, hijyen nedeniyle ambalajı açılmış iade edilemeyecek ürünler vb.) hariç tüm ürünlerde cayma hakkı geçerlidir.</p>' +
    '<h3>Cayma Hakkı Bildirim Formu</h3>' +
    '<p style="background:var(--bg2);padding:12px;border-radius:10px">' +
    'Kime: ' + I.marka + (I.adres ? ' – ' + I.adres : '') + '<br>' +
    'Aşağıdaki malların satışına ilişkin sözleşmeden cayma hakkımı kullandığımı beyan ederim.<br>' +
    'Sipariş numarası / sipariş tarihi: ........................<br>' +
    'Mal(lar)ın adı ve adedi: ........................<br>' +
    'Teslim alındığı tarih: ........................<br>' +
    'Tüketicinin adı soyadı, adresi: ........................<br>' +
    'İade bedelinin yatırılacağı IBAN: ........................<br>' +
    'Tarih / İmza: ........................</p>' };

  P["teslimat-ve-odeme"] = { title: "Teslimat ve Ödeme", html:
    '<h3>Ödeme</h3>' +
    '<p>Siparişlerde <b>kapıda ödeme</b> geçerlidir. Ürün bedelini, ürün size teslim edilirken kargo görevlisine ödersiniz. Sitede kart bilgisi alınmaz.</p>' +
    '<h3>Kargo Ücreti</h3><p>Şu an tüm siparişlerde kargo <b>ücretsizdir</b>. Kampanya koşulları değişirse sipariş özetinde açıkça belirtilir.</p>' +
    '<h3>Teslimat Süresi</h3>' +
    '<p>Siparişler en kısa sürede hazırlanıp anlaşmalı kargo firmasına teslim edilir. Kargo takip bilgisi talep üzerine paylaşılır. Teslimat süresi yasal azami süre olan 30 günü aşmaz.</p>' +
    '<h3>Teslim Alırken</h3>' +
    '<p>Paketi teslim almadan önce hasar veya açılma olup olmadığını kontrol edin. Sorun varsa kargo görevlisine tutanak tutturun ve bize bildirin.</p>' +
    '<h3>Teslim Edilemeyen Siparişler</h3>' +
    '<p>Adrese ulaşılamaması veya siparişin kabul edilmemesi durumunda sipariş bize iade edilebilir; bu durumda sizinle iletişime geçeriz.</p>' };

  window.LEGAL_PAGES = P;
  window.LEGAL_ORDER = [
    ["mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi"],
    ["on-bilgilendirme-formu", "Ön Bilgilendirme Formu"],
    ["kvkk-aydinlatma-metni", "KVKK Aydınlatma Metni"],
    ["gizlilik-ve-cerez-politikasi", "Gizlilik ve Çerez Politikası"],
    ["iade-cayma-ve-degisim", "İade, Cayma ve Değişim"],
    ["teslimat-ve-odeme", "Teslimat ve Ödeme"],
    ["hakkimizda", "Hakkımızda & İletişim"]
  ];
})();
