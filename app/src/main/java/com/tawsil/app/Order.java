package com.tawsil.app;

import java.io.Serializable;

/**
 * نموذج الطلب — يُخزّن في مجموعة "orders" في Firestore.
 * status: pending -> accepted -> picked_up -> delivered  (أو cancelled)
 */
public class Order implements Serializable {
    public String id;              // document id في Firestore
    public String clientId;
    public String clientName;
    public String clientPhone;
    public String livreurId;       // فارغ حتى يقبل ليفرور الطلب
    public String livreurName;
    public String pickupAddress;
    public String dropAddress;
    public String description;
    public double price;
    public String status;          // pending, accepted, picked_up, delivered, cancelled
    public long createdAt;

    public static final String STATUS_PENDING = "pending";
    public static final String STATUS_ACCEPTED = "accepted";
    public static final String STATUS_PICKED_UP = "picked_up";
    public static final String STATUS_DELIVERED = "delivered";
    public static final String STATUS_CANCELLED = "cancelled";

    public Order() {
        // مطلوب فارغ constructor لـ Firestore
    }

    public Order(String clientId, String clientName, String clientPhone,
                  String pickupAddress, String dropAddress, String description, double price) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.pickupAddress = pickupAddress;
        this.dropAddress = dropAddress;
        this.description = description;
        this.price = price;
        this.status = STATUS_PENDING;
        this.createdAt = System.currentTimeMillis();
    }

    public String statusLabel() {
        if (status == null) return "";
        switch (status) {
            case STATUS_PENDING: return "في الانتظار";
            case STATUS_ACCEPTED: return "تم القبول";
            case STATUS_PICKED_UP: return "تم الاستلام";
            case STATUS_DELIVERED: return "تم التوصيل";
            case STATUS_CANCELLED: return "ملغى";
            default: return status;
        }
    }
}
