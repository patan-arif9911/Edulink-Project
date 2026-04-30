package com.edulink.identityservice.service;

import com.edulink.identityservice.entity.User;
import com.edulink.identityservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplianceService {

    @Autowired
    private  UserRepository userRepository;

    public Map<String,Integer> getUsers(){
        List<User> user=userRepository.findAll();
        Map<String,Integer> userCar=new HashMap<>();

        for(User u:user){
            String key=u.getRole().toString();
            if(!userCar.containsKey(key)){
                userCar.put(key,1);
            }else{
                int tem=userCar.get(key)+1;
                userCar.put(key,tem);
            }
        }

        return userCar;
    }
}
