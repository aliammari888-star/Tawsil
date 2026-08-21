package com.tawsil.app;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.VH> {

    public interface OnOrderClick {
        void onClick(Order order);
    }

    private final List<Order> items = new ArrayList<>();
    private final OnOrderClick listener;

    public OrderAdapter(OnOrderClick listener) {
        this.listener = listener;
    }

    public void setItems(List<Order> newItems) {
        items.clear();
        items.addAll(newItems);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        Order order = items.get(position);
        holder.tvDescription.setText(order.description == null || order.description.isEmpty()
                ? "طلب توصيل" : order.description);
        holder.tvRoute.setText(String.format("من: %s  ←  إلى: %s", order.pickupAddress, order.dropAddress));
        holder.tvPrice.setText(String.format(Locale.getDefault(), "%.3f د.ت", order.price));
        holder.tvStatus.setText(order.statusLabel());

        int color = statusColor(holder.itemView.getContext(), order.status);
        GradientDrawable bg = (GradientDrawable) holder.tvStatus.getBackground().mutate();
        bg.setColor(color);

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onClick(order);
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    private int statusColor(android.content.Context ctx, String status) {
        int resId;
        if (status == null) status = Order.STATUS_PENDING;
        switch (status) {
            case Order.STATUS_ACCEPTED: resId = R.color.status_accepted; break;
            case Order.STATUS_PICKED_UP: resId = R.color.status_picked_up; break;
            case Order.STATUS_DELIVERED: resId = R.color.status_delivered; break;
            case Order.STATUS_CANCELLED: resId = R.color.status_cancelled; break;
            default: resId = R.color.status_pending;
        }
        return ctx.getResources().getColor(resId);
    }

    static class VH extends RecyclerView.ViewHolder {
        android.widget.TextView tvDescription, tvRoute, tvPrice, tvStatus;
        VH(View v) {
            super(v);
            tvDescription = v.findViewById(R.id.tvDescription);
            tvRoute = v.findViewById(R.id.tvRoute);
            tvPrice = v.findViewById(R.id.tvPrice);
            tvStatus = v.findViewById(R.id.tvStatus);
        }
    }
}
