package com.edulink.identityservice.service;
import com.edulink.identityservice.entity.*;
import com.edulink.identityservice.entity.User;
import com.edulink.identityservice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.edulink.identityservice.dto.*;
import com.edulink.identityservice.entity.*;
import com.edulink.identityservice.repository.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ComplianceService {
    private static final Logger log = LoggerFactory.getLogger(ComplianceService.class);
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
