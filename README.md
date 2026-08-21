# Tawsil — تطبيق توصيل الطلبات

تطبيق أندرويد (Java) لإدارة طلبات التوصيل بثلاثة أدوار:
- **Client** — ينشئ طلبات توصيل ويتابعها.
- **Livreur** — يشوف الطلبات المتاحة، يقبلها، ويحدث حالتها للاستلام والتوصيل.
- **Admin** — يشوف كل الطلبات وكل المستخدمين من لوحة تحكم واحدة.

البيانات والمصادقة مبنية بالكامل على **Firebase** (Authentication + Cloud Firestore، وقت حقيقي).

---

## 1) هيكل المشروع

```
app/src/main/java/com/tawsil/app/
├── TawsilApplication.java      # Application class
├── User.java / Order.java      # نماذج البيانات
├── FirebaseUtil.java           # أدوات مساعدة (Auth + Firestore)
├── SplashActivity.java         # يوجّه المستخدم حسب حالة الدخول والدور
├── LoginActivity.java / RegisterActivity.java
├── ClientHomeActivity.java / CreateOrderActivity.java
├── LivreurHomeActivity.java
├── AdminHomeActivity.java
├── OrderDetailActivity.java    # شاشة مشتركة، الأزرار تتغير حسب الدور
├── OrderAdapter.java / UserAdapter.java
```

كل الـ layouts (XML) موجودة في `app/src/main/res/layout/`.

---

## 2) إعداد Firebase (خطوات إجبارية قبل تشغيل التطبيق)

1. روح لـ [Firebase Console](https://console.firebase.google.com) وأنشئ مشروع جديد (مثلاً `tawsil`).
2. زيد تطبيق Android بـ package name: **`com.tawsil.app`**
3. حمّل ملف `google-services.json` وحطو في `app/google-services.json`
   (فما نموذج توضيحي في `app/google-services.json.example` باش تفهم الشكل، لازم تبدلو بالملف الحقيقي).
4. من قائمة **Build > Authentication**: فعّل طريقة الدخول **Email/Password**.
5. من قائمة **Build > Firestore Database**: أنشئ قاعدة بيانات (ابدأ بـ *test mode* للتجربة، وبعدين استعمل قواعد الأمان في `firestore.rules` اللي موجودة في جذر المشروع — انسخها لتبويب "Rules" في الـ Console).

### إنشاء أول حساب Admin
التسجيل داخل التطبيق يعطي بس دور `client` أو `livreur`. باش تصنع أدمن:
1. سجل حساب عادي من التطبيق (كـ client مثلاً).
2. روح لـ Firestore Console → مجموعة `users` → دوّر على الوثيقة متاع الحساب.
3. بدل قيمة الحقل `role` من `"client"` إلى `"admin"` يدويًا.
4. سجل خروج ودخول من جديد في التطبيق.

---

## 3) فتح وتشغيل المشروع

1. افتح المجلد في **Android Studio** (نسخة حديثة، Gradle 8.6+).
2. تأكد من وجود `app/google-services.json` (خطوة 2 فوق).
3. Sync Gradle، ثم Run على جهاز أو محاكي متصل بالإنترنت.

> ملاحظة: بعض الاستعلامات (مثل طلبات العميل مرتبة حسب التاريخ) تحتاج **composite index** في Firestore. إذا ظهر خطأ في الـ Logcat فيه رابط، افتحو مباشرة — Firebase ينشئ الـ index أوتوماتيكيًا بضغطة واحدة.

---

## 4) قاعدة بيانات Firestore — الهيكلة

**Collection: `users`**
| field | type | ملاحظة |
|---|---|---|
| uid | string | نفس Firebase Auth UID |
| name, phone, email | string | |
| role | string | `client` \| `livreur` \| `admin` |
| createdAt | number | timestamp |

**Collection: `orders`**
| field | type | ملاحظة |
|---|---|---|
| clientId, clientName, clientPhone | string | |
| livreurId, livreurName | string \| null | يتعمر عند القبول |
| pickupAddress, dropAddress, description | string | |
| price | number | |
| status | string | `pending` → `accepted` → `picked_up` → `delivered` (أو `cancelled`) |
| createdAt | number | timestamp |

---

## 5) شنية الباقي / أفكار للتطوير

- إشعارات Push (Firebase Cloud Messaging) عند تغيّر حالة الطلب.
- تتبع الموقع الحي للموصل بخرائط Google Maps.
- الدفع الإلكتروني.
- صفحة تعديل بروفايل المستخدم.
- تقييم الموصل بعد كل توصيل.

هذا الهيكل جاهز ومربوط بـ Firebase — أي إضافة جديدة تقدر تبني عليه مباشرة.
