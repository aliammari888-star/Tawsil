package com.tawsil.app;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

public class UserAdapter extends RecyclerView.Adapter<UserAdapter.VH> {

    private final List<User> items = new ArrayList<>();

    public void setItems(List<User> newItems) {
        items.clear();
        items.addAll(newItems);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_user, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        User user = items.get(position);
        holder.tvName.setText(user.name);
        holder.tvContact.setText(user.email + " · " + user.phone);
        holder.tvRole.setText(roleLabel(user.role));
    }

    private String roleLabel(String role) {
        if (role == null) return "";
        switch (role) {
            case "admin": return "أدمن";
            case "livreur": return "موصل";
            default: return "عميل";
        }
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView tvName, tvContact, tvRole;
        VH(View v) {
            super(v);
            tvName = v.findViewById(R.id.tvName);
            tvContact = v.findViewById(R.id.tvContact);
            tvRole = v.findViewById(R.id.tvRole);
        }
    }
}
