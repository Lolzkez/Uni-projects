package com.example.ytapptest

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import kotlin.math.pow

class MainActivity : AppCompatActivity(), View.OnClickListener {
    lateinit var btnAdd : Button
    lateinit var btnSubtract : Button
    lateinit var btnMultiply : Button
    lateinit var btnDiv : Button
    lateinit var btnMod : Button
    lateinit var btnPower : Button

    lateinit var etA : EditText
    lateinit var etB : EditText
    lateinit var resultTv : TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        btnAdd = findViewById(R.id.btn_add)
        btnSubtract = findViewById(R.id.btn_subtract)
        btnMultiply = findViewById(R.id.btn_multiply)
        btnDiv = findViewById(R.id.btn_div)
        btnMod = findViewById(R.id.btn_mod)
        btnPower = findViewById(R.id.btn_power)
        etA = findViewById(R.id.et_a)
        etB = findViewById(R.id.et_b)
        resultTv = findViewById(R.id.result_tv)

        btnAdd.setOnClickListener(this)
        btnSubtract.setOnClickListener(this)
        btnMultiply.setOnClickListener(this)
        btnDiv.setOnClickListener(this)
        btnMod.setOnClickListener(this)
        btnPower.setOnClickListener(this)
    }

    override fun onClick(v: View?) {
        var a = etA.text.toString().toDouble()
        var b = etB.text.toString().toDouble()
        var result : Double = 0.0
        when(v?.id) {
            R.id.btn_add -> {
                result = a + b
            }
            R.id.btn_subtract -> {
                result = a - b
            }
            R.id.btn_multiply -> {
                result = a * b
            }
            R.id.btn_div -> {
                result = a / b
            }
            R.id.btn_mod -> {
                result = a % b
            }
            R.id.btn_power -> {
                result = a.pow(b)
            }
        }
        resultTv.text = "Result is $result"
    }
}