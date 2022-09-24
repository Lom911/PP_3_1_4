package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.Collection;
import java.util.Set;

public interface RoleService {

    void add(Role role);

    Role findByRoleName(String role);

    Collection<Role> getAllRoles();

    Set<Role> getSetOfRole(String[] roleName);

    Role getById(int id);
}
